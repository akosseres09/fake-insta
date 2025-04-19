import { Post } from './Post';
import { User } from './User';

export interface PostComment<TUser = string, TPost = string> {
    _id: string;
    userId: TUser;
    postId: TPost;
    text: string;
    createdAt: Date;
}

export type PostCommentWithUser = PostComment<User>;
export type PostCommentWithPost = PostComment<string, Post>;
export type PostCommentWithUserAndPost = PostComment<User, Post>;
