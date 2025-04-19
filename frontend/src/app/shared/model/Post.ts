import { Like } from './Like';
import { User } from './User';

export interface Post<TComment = string, TLike = string> {
    _id: string;
    userId: string | User;
    mediaUrl: string;
    mediaType: string;
    mediaPublicId: string;
    caption: string;
    altText: string;
    createdAt: Date;
    updatedAt: Date;
    likes: Array<TLike>;
    comments: Array<TComment>;
}

export type PostWithComments = Post<Comment>;
export type PostWithLikes = Post<string, Like>;
export type PostWithCommentsAndLikes = Post<Comment, Like>;

export interface IBodyPost {
    userId: string;
    media: any;
    caption: string;
    altText: string;
}
