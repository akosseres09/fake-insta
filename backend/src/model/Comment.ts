import mongoose from 'mongoose';

interface IComment extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
}

const CommentSchema = new mongoose.Schema<IComment>({
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
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
});

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
