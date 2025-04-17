import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from '../../model/Response';
import { User } from '../../model/User';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../../model/Post';

interface Result<T, Z> {
    user: T;
    posts: Z;
}

interface FRes<T> {
    user: T;
    otherUser: T;
}

type PostResponse = IResponse<Result<User, Array<Post>>>;
export type FollowResponse = IResponse<FRes<User>>;

@Injectable({
    providedIn: 'root',
})
export class UserService {
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
        const inArray = 'false';
        return this.http.get<IResponse<User>>(`http://localhost:3000/user`, {
            params: { id: id, inArray: inArray },
            withCredentials: true,
        });
    }

    getUsersBySearch(username: string) {
        return this.http.get<IResponse<Array<User>>>(
            'http://localhost:3000/user',
            {
                params: {
                    username,
                },
                withCredentials: true,
            }
        );
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

    follow(data: any) {
        const form: FormData = new FormData();
        Object.keys(data).forEach((key) => {
            form.append(key, data[key]);
        });

        return this.http.post<FollowResponse>(
            'http://localhost:3000/follow',
            data,
            {
                withCredentials: true,
            }
        );
    }
}
