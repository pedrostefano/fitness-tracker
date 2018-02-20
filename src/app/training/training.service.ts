import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore } from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';

import * as fromTraining from './training.reducer';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {

    private fbSubscriptions: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ) {}

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading);
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
                    this.store.dispatch(new UI.StopLoading);
                    this.store.dispatch(new Training.SetAvailableTraining(exercises));
                }, error => {
                    this.store.dispatch(new UI.StopLoading);
                    this.uiService.showSnackbar('Fetching exercices failed. Please try again.', null, 3000);
                })
            );
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubscriptions.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new Training.SetFinishedTraining(exercises));
            }));
    }

    cancelSubscriptions() {
        this.fbSubscriptions.forEach(sub => sub.unsubscribe());
    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTrainings).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase(
                {
                    ...ex,
                    date: new Date(),
                    state: 'completed'
                });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTrainings).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                    ...ex,
                    state: 'cancelled',
                    duration: ex.duration * (progress / 100),
                    calories: ex.calories * (progress / 100),
                    date: new Date()
                });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}
