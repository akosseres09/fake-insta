export interface Post {
    userId: string;
    mediaUrl: string;
    mediaType: string;
    caption: string;
    altText: string;
    createdAt: Date;
    updatedAt: Date;
    likes: Array<{ id: string }>;
    comments: Array<{ id: string }>;
}

export interface IBodyPost {
    userId: string;
    media: any;
    caption: string;
    altText: string;
}
