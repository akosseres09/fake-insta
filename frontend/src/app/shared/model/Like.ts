import { Post } from './Post';
import { User } from './User';

export interface Like<TUser = string, TPost = string> {
    _id: string;
    userId: TUser;
    postId: TPost;
    createdAt: Date;
}

export type LikeWithUser = Like<User>;
export type LikeWithPost = Like<string, Post>;
export type LikeWithUserAndPost = Like<User, Post>;
