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
    profilePictureUrl?: string;
    isAdmin: boolean;
    followers: [
        {
            id: string;
        }
    ];
    following: [
        {
            id: string;
        }
    ];
}
