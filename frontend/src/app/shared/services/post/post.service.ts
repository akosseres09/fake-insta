import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, IBodyPost } from '../../model/Post';
import { IResponse } from '../../model/Response';

@Injectable({
    providedIn: 'root',
})
export class PostService {
    constructor(private http: HttpClient) {}

    createPost(post: IBodyPost) {
        const formData = new FormData();
        formData.append('media', post.media);
        formData.append('caption', post.caption);
        formData.append('altText', post.altText);
        formData.append('userId', post.userId);

        return this.http.post<IResponse<Post | string>>(
            'http://localhost:3000/createPost',
            formData,
            {
                withCredentials: true,
            }
        );
    }

    getPosts() {
        return this.http.get<IResponse<Array<Post> | string>>(
            'http://localhost:3000/posts',
            {
                withCredentials: true,
            }
        );
    }
}
