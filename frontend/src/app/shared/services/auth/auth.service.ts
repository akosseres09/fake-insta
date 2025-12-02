import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { IResponse } from '../../model/Response';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}
    private apiUrl = environment.apiUrl;

    login(username: string, password: string) {
        const body = new URLSearchParams();
        body.set('username', username);
        body.set('password', password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post<IResponse<User | string>>(
            `${this.apiUrl}login`,
            body,
            {
                headers: headers,
                withCredentials: true
            }
        );
    }

    register(user: User) {
        const body = new URLSearchParams();
        body.set('email', user.email);
        body.set('first', user.name.first);
        body.set('last', user.name.last);
        body.set('username', user.username);
        body.set('password', user.password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post(`${this.apiUrl}register`, body, {
            headers: headers
        });
    }

    logout() {
        return this.http.post(
            `${this.apiUrl}logout`,
            {},
            { withCredentials: true, responseType: 'text' }
        );
    }

    checkId() {
        return this.http.get(`${this.apiUrl}checkId`, {
            withCredentials: true,
            responseType: 'text'
        });
    }

    checkauth() {
        return this.http.get<boolean>(`${this.apiUrl}checkauth`, {
            withCredentials: true
        });
    }

    checkAdmin() {
        return this.http.get<boolean>(`${this.apiUrl}checkAdmin`, {
            withCredentials: true
        });
    }
}
