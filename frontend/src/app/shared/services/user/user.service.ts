import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from '../../model/Response';
import { User } from '../../model/User';
import { BehaviorSubject } from 'rxjs';

interface FRes<T> {
    user: T;
    otherUser: T;
}

type PostResponse = IResponse<User>;
export type FollowResponse = IResponse<FRes<User>>;

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userSubject: BehaviorSubject<User | null> =
        new BehaviorSubject<User | null>(null);
    private USER_URL = 'http://localhost:3000/user';
    private FOLLOW_URL = 'http://localhost:3000/follow';

    constructor(private http: HttpClient) {}

    setUser(user: User) {
        this.userSubject.next(user);
    }

    getCurrentUser(): User {
        return this.userSubject.value as User;
    }

    getUser(id: string) {
        const inArray = 'false';
        return this.http.get<IResponse<User>>(this.USER_URL, {
            params: { id: id, inArray: inArray },
            withCredentials: true,
        });
    }

    getAllUsers() {
        return this.http.get<IResponse<Array<User>>>(this.USER_URL, {
            withCredentials: true,
        });
    }

    getUsersBySearch(username: string) {
        return this.http.get<IResponse<Array<User>>>(this.USER_URL, {
            params: {
                username,
            },
            withCredentials: true,
        });
    }

    getUserProfile(id: string) {
        return this.http.get<PostResponse>(this.USER_URL, {
            params: {
                id: id,
                populate: 'post',
                inArray: 'false',
            },
            withCredentials: true,
        });
    }

    updateUser(data: FormData) {
        return this.http.post<IResponse<User | string>>(this.USER_URL, data, {
            withCredentials: true,
        });
    }

    follow(data: any) {
        const form: FormData = new FormData();
        Object.keys(data).forEach((key) => {
            form.append(key, data[key]);
        });

        return this.http.post<FollowResponse>(this.FOLLOW_URL, data, {
            withCredentials: true,
        });
    }
}
