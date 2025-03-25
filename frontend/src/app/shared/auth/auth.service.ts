import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    getUser(id: string) {
        return this.http.get(`http://localhost:3000/user/${id}`);
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

    checkauth() {
        return this.http.get<boolean>('http://localhost:3000/checkauth', {
            withCredentials: true,
        });
    }
}
