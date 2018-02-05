import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore } from 'angularfire2/firestore';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();

    private runningExercise: Exercise;
    private availableExercise: Exercise[] = [];
    private fbSubscriptions: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService) {}

    fetchAvailableExercises() {
        this.uiService.loadingStateChanged.next(true);
        this.fbSubscriptions.push(this.db
            .collection('availableExercises')
            .snapshotChanges()
            .map(docArray => {
            return docArray.map(doc => {
                return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data().name,
                duration: doc.payload.doc.data().duration,
                calories: doc.payload.doc.data().calories
                };
            });
        })
        .subscribe((exercises: Exercise[]) => {
            this.uiService.loadingStateChanged.next(false);
            this.availableExercise = exercises;
            this.exercisesChanged.next([...this.availableExercise]);
        }));
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubscriptions.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.finishedExercisesChanged.next(exercises);
            }));
    }

    cancelSubscriptions() {
        this.fbSubscriptions.forEach(sub => sub.unsubscribe());
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercise.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
                ...this.runningExercise,
                state: 'cancelled',
                duration: this.runningExercise.duration * (progress / 100),
                calories: this.runningExercise.calories * (progress / 100),
                date: new Date()
            });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }



    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}
