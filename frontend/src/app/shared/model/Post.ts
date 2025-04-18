import { Like } from './Like';
import { User } from './User';

export interface Post {
    userId: string | User;
    mediaUrl: string;
    mediaType: string;
    caption: string;
    altText: string;
    createdAt: Date;
    updatedAt: Date;
    likes: Array<string | Like>;
    comments: Array<string | Comment>;
}

export interface IBodyPost {
    userId: string;
    media: any;
    caption: string;
    altText: string;
}
