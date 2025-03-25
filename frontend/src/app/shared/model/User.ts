export interface User {
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
