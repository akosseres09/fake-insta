import mongoose, { Model, Types } from 'mongoose';

interface IPost extends mongoose.Document {
    userId: Types.ObjectId;
    mediaUrl: string;
    mediaType: string;
    caption: string;
    altText: string;
    createdAt: Date;
    updatedAt: Date;
    likes: Array<{ id: string }>;
    comments: Array<{ id: string }>;
}

const PostSchema = new mongoose.Schema<IPost>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, required: true },
    caption: { type: String, default: '' },
    altText: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    likes: [{ id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
    comments: [{ id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
});

export const Post: Model<IPost> = mongoose.model<IPost>('Post', PostSchema);
