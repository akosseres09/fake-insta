import { Post } from './Post';

export interface User {
    _id: string;
    email: string;
    username: string;
    password: string;
    name: {
        first: string;
        last: string;
    };
    bio?: string;
    profilePictureUrl: string;
    isAdmin: boolean;
    followers: Array<string>;
    following: Array<string>;
    posts: Array<string> | Array<Post>;
}
