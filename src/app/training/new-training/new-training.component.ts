import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  isLoading = false;
  exercisesSubscription: Subscription;
  isLoadingSubscription: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  ngOnInit() {

    this.isLoadingSubscription = this.uiService.loadingStateChanged
    .subscribe(isLoading => this.isLoading = isLoading);

    this.exercisesSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => this.exercises = exercises);

    this.fetchAvailableExercises();
  }

  fetchAvailableExercises() {
    this.trainingService.fetchAvailableExercises();
  }
  ngOnDestroy() {
    this.exercisesSubscription.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
