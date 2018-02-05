import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth} from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';

import { MatSnackBar } from '@angular/material';

import { AuthData } from './auth-date.model';
import { User } from './user.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {

    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private snackbar: MatSnackBar,
        private uiService: UIService,
        private trainingServices: TrainingService) { }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.authChange.next(true);
                this.router.navigate(['/training']);
                this.isAuthenticated = true;
            } else {
                this.trainingServices.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        });
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.snackbar.open(error.message, null, {
                    duration: 2000
                });
            });
    }

    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.snackbar.open(error.message, null, {
                    duration: 2000
                });
                console.log(error);
            });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }

}
