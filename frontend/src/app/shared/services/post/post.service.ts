import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, IBodyPost } from '../../model/Post';
import { IResponse } from '../../model/Response';

@Injectable({
    providedIn: 'root',
})
export class PostService {
    private POST_URL = 'http://localhost:3000/post';

    constructor(private http: HttpClient) {}

    createPost(post: IBodyPost) {
        const formData = new FormData();
        formData.append('media', post.media);
        formData.append('caption', post.caption);
        formData.append('altText', post.altText);
        formData.append('userId', post.userId);

        return this.http.post<IResponse<Post | string>>(
            this.POST_URL,
            formData,
            {
                withCredentials: true,
            }
        );
    }

    getPosts() {
        return this.http.get<IResponse<Array<Post>>>(this.POST_URL, {
            params: {
                populate: 'userId',
            },
            withCredentials: true,
        });
    }

    getPostById(id: string) {
        return this.http.get<IResponse<Post>>(this.POST_URL, {
            params: {
                inArray: 'false',
                postId: id,
                populate: 'userId',
                follow: 'false',
            },
            withCredentials: true,
        });
    }

    updatePost(id: string) {
        const data = {
            postId: id,
        };

        return this.http.post<IResponse<string>>(this.POST_URL, data, {
            withCredentials: true,
        });
    }

    deletePost(id: string) {
        return this.http.delete<IResponse<string>>(this.POST_URL + `/${id}`, {
            withCredentials: true,
        });
    }
}
