import mongoose, { Types } from 'mongoose';

export const types = ['postViolation', 'profileViolation'] as const;
export type NotificationType = (typeof types)[number];
interface INotification extends mongoose.Document {
    userId: Types.ObjectId;
    postId: Types.ObjectId;
    seenByUser: boolean;
    reason: string;
    type: NotificationType;
    deletedPost: boolean;
    createdAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: function () {
            return this.type === 'postViolation';
        },
    },
    seenByUser: { type: Boolean, default: false },
    reason: { type: String, required: true },
    type: { type: String, enum: types, required: true },
    deletedPost: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model<INotification>(
    'Notification',
    NotificationSchema
);
