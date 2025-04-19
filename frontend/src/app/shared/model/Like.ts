import { Post } from './Post';
import { User } from './User';

export interface Like {
    _id: string;
    userId: string | User;
    postId: string | Post;
    createdAt: Date;
}
