import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostComment, PostCommentWithUser } from '../../model/Comment';
import { IResponse } from '../../model/Response';
import { Post } from '../../model/Post';
import { environment } from '../../../../environments/environment';

export interface PostData {
    postId: string;
    userId: string;
    text: string;
}

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrl = environment.apiUrl;
    private COMMENT_URL = `${this.apiUrl}comment`;
    constructor(private http: HttpClient) {}

    getCommentsToPost(postId: string) {
        return this.http.get<IResponse<Array<PostCommentWithUser>>>(
            this.COMMENT_URL,
            {
                params: { postId: postId, populate: 'userId' },
                withCredentials: true
            }
        );
    }

    createComment(data: PostData) {
        return this.http.post<IResponse<Post>>(this.COMMENT_URL, data, {
            withCredentials: true
        });
    }
}
