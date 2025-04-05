import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { BehaviorSubject, tap } from 'rxjs';
import { IResponse } from '../../model/Response';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userSubject: BehaviorSubject<User | null> =
        new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) {}

    setUser(user: User) {
        this.userSubject.next(user);
    }

    getUser(id: string) {
        return this.http
            .get(`http://localhost:3000/user/${id}`)
            .pipe(tap((user) => this.userSubject.next(user as User)));
    }

    updateUser(user: User) {
        const body = new URLSearchParams();
        body.set('_id', user._id);
        body.set('email', user.email);
        body.set('first', user.name.first);
        body.set('last', user.name.last);
        body.set('username', user.username);
        body.set('bio', user.bio ?? '');
        body.set('profilePictureUrl', user.profilePictureUrl ?? '');

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http.post<IResponse<User | string>>(
            `http://localhost:3000/update/${user._id}`,
            body,
            {
                headers: headers,
                withCredentials: true,
            }
        );
    }

    login(username: string, password: string) {
        const body = new URLSearchParams();
        body.set('username', username);
        body.set('password', password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http.post('http://localhost:3000/login', body, {
            headers: headers,
            withCredentials: true,
            responseType: 'text',
        });
    }

    register(user: User) {
        const body = new URLSearchParams();
        body.set('email', user.email);
        body.set('first', user.name.first);
        body.set('last', user.name.last);
        body.set('username', user.username);
        body.set('password', user.password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http.post('http://localhost:3000/register', body, {
            headers: headers,
        });
    }

    logout() {
        return this.http.post(
            'http://localhost:3000/logout',
            {},
            { withCredentials: true, responseType: 'text' }
        );
    }

    checkId() {
        return this.http.get('http://localhost:3000/checkId');
    }

    checkauth() {
        return this.http.get<boolean>('http://localhost:3000/checkauth', {
            withCredentials: true,
        });
    }

    checkAdmin() {
        return this.http.get<boolean>('http://localhost:3000/checkAdmin', {
            withCredentials: true,
        });
    }
}
