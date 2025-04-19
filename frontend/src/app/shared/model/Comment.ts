import { Post } from './Post';
import { User } from './User';

export interface PostComment {
    _id: string;
    userId: string | User;
    postId: string | Post;
    text: string;
    createdAt: Date;
}
