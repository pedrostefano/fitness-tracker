import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth} from 'angularfire2/auth';

import { Subject } from 'rxjs/Subject';

import { AuthData } from './auth-date.model';
import { User } from './user.model';

@Injectable()
export class AuthService {

    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router: Router, private afAuth: AngularFireAuth) { }

    registerUser(authData: AuthData) {
        this.afAuth.auth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result);
                this.authSuccess();
            })
            .catch(error => {
                console.log(error);
            });
    }

    login(authData: AuthData) {
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result);
                this.authSuccess();
            })
            .catch(error => {
                console.log(error);
            });
        this.authSuccess();
    }

    logout() {
        this.afAuth.auth.signOut();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
    }

    isAuth() {
        return this.isAuthenticated;
    }

    private authSuccess() {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }

}
