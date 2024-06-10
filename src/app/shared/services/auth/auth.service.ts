import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from "rxjs";
import { LoginData, SignUpData, UserDetails } from "./auth.model";
import { Route, Router } from "@angular/router";
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _userDetails$: BehaviorSubject<UserDetails> =
        new BehaviorSubject<UserDetails>({} as UserDetails);

    url = "http://localhost:3000/users";

    constructor(private http: HttpClient, private router: Router) {
    }
    public get userDetails(): Observable<UserDetails> {
        return this._userDetails$.asObservable();
    }

    // signIn(data: LoginData): Observable<UserDetails> {
    //     return this.http.get<UserDetails>(this.url + `?email=${data.email}&&password=${data.password}`).pipe(
    //         map(user => {
    //             if (user) {
    //                 return user
    //             } else {
    //                 throw new Error('Datele primite de la server nu sunt de tipul așteptat.');
    //             }
    //         })
    //     );
    // }
    signIn(data: LoginData): Observable<UserDetails> {
        return this.http.get<UserDetails>(this.url).pipe(
            map(users => {
                if (Array.isArray(users)) {
                    const matchingUser = users.find(user => user.email === data.email && user.password === data.password);
                    if (matchingUser) {
                        this._userDetails$.next(matchingUser);
                        return matchingUser;
                    } else {
                        return null;
                    }
                } else {
                    throw new Error('Datele primite de la server nu sunt de tipul așteptat.');
                }
            })
        );
    }
    signUp(data: SignUpData): Observable<UserDetails> {
        let NewData: UserDetails = {
            id: this.generateUserId(data.email, data.fullName),
            email: data.email,
            fullName: data.fullName,
            password: data.password,
            projects: [],
            image: ""
        }
        return this.http.post<UserDetails>(this.url, NewData).pipe(tap(() => {
            this._userDetails$.next(NewData);
            return NewData;
        }));
    }

    logout() {
        localStorage.removeItem('userDetails');
        this.router.navigate(['/auth']);
        let user: UserDetails = {
            id: '',
            email: '',
            fullName: 'string',
            password: '',
            projects: [],
            image: ""
        }
        this._userDetails$.next(user);
    }

    autoLogin() {
        const storedUserDetails = localStorage.getItem('userDetails');
        if (storedUserDetails) {
            const userData = JSON.parse(storedUserDetails);
            this._userDetails$.next(userData);
        } else {
            let user: UserDetails = {
                id: '',
                image: '',
                email: '',
                fullName: 'string',
                password: '',
                projects: []
            }
            this._userDetails$.next(user);
        }
    }

    private generateUserId(email: string, name: string): string {
        const data = email + 'ExcellApp' + name;
        const hash = CryptoJS.SHA256(data).toString();
        return hash;
    }
}