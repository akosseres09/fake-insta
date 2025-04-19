import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostComment, PostCommentWithUser } from '../../model/Comment';
import { IResponse } from '../../model/Response';

export interface PostData {
    postId: string;
    userId: string;
    text: string;
}

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    private COMMENT_URL = 'http://localhost:3000/comment';
    constructor(private http: HttpClient) {}

    getCommentsToPost(postId: string) {
        return this.http.get<IResponse<Array<PostCommentWithUser>>>(
            this.COMMENT_URL,
            {
                params: { postId: postId, populate: 'userId' },
                withCredentials: true,
            }
        );
    }

    createComment(data: PostData) {
        return this.http.post<IResponse<PostComment>>(this.COMMENT_URL, data, {
            withCredentials: true,
        });
    }
}
