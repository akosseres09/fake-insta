import mongoose, { Model } from 'mongoose';

interface ILike extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const LikeSchema = new mongoose.Schema<ILike>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    createdAt: { type: Date, default: Date.now() },
});

export const Like: Model<ILike> = mongoose.model<ILike>('Like', LikeSchema);
