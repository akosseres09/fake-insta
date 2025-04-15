import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { BehaviorSubject, tap } from 'rxjs';
import { IResponse } from '../../model/Response';
import { Post } from '../../model/Post';

interface Result {
    user: User;
    posts: Post[];
}

type PostResponse = IResponse<Result>;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userSubject: BehaviorSubject<User | null> =
        new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient) {}

    setUser(user: User) {
        this.userSubject.next(user);
    }

    getCurrentUser(): User {
        return this.userSubject.value as User;
    }

    getUser(id: string) {
        return this.http
            .get(`http://localhost:3000/user/${id}`)
            .pipe(tap((user) => this.setUser(user as User)));
    }

    getUserProfile(id: string) {
        return this.http.get<PostResponse>(
            `http://localhost:3000/userProfile/${id}`,
            {
                withCredentials: true,
            }
        );
    }

    updateUser(data: any, userId: string) {
        const form: FormData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key === 'name') {
                form.append('first', data[key].first);
                form.append('last', data[key].last);
            } else {
                form.append(key, data[key]);
            }
        });

        return this.http.post<IResponse<User | string>>(
            `http://localhost:3000/update/${userId}`,
            form,
            {
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
