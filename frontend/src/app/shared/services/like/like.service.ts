import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from '../../model/Response';
import { Post } from '../../model/Post';
import { LikeWithUser } from '../../model/Like';
import { environment } from '../../../../environments/environment';

export interface Data {
    userId: string;
    postId: string;
    populate: string;
    action: 'like' | 'unlike';
}

@Injectable({
    providedIn: 'root'
})
export class LikeService {
    private apiUrl = environment.apiUrl;
    private LIKE_URL = `${this.apiUrl}like`;
    constructor(private http: HttpClient) {}

    getLikes(data: any) {
        return this.http.get<IResponse<Array<LikeWithUser> | string>>(
            this.LIKE_URL,
            {
                params: data,
                withCredentials: true
            }
        );
    }

    likePost(formData: Data) {
        return this.http.post<IResponse<Post>>(this.LIKE_URL, formData, {
            withCredentials: true
        });
    }
}
