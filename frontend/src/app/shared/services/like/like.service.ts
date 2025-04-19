import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from '../../model/Response';
import { Post } from '../../model/Post';

export interface Data {
    userId: string;
    postId: string;
    populate: string;
    action: 'like' | 'unlike';
}

@Injectable({
    providedIn: 'root',
})
export class LikeService {
    private LIKE_URL = 'http://localhost:3000/like';
    constructor(private http: HttpClient) {}

    getLikes(data: Data) {
        return this.http.get<IResponse<Array<Post> | string>>(this.LIKE_URL, {
            params: {
                userId: data.userId ?? '',
                postId: data.postId ?? '',
                populate: data.populate,
                action: data.action,
            },
            withCredentials: true,
        });
    }

    likePost(formData: Data) {
        return this.http.post<IResponse<Post>>(this.LIKE_URL, formData, {
            withCredentials: true,
        });
    }
}
