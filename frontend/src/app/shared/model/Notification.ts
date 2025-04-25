import { Post } from './Post';
import { User } from './User';

export const types = ['postViolation', 'profileViolation'] as const;
export type NotificationType = (typeof types)[number];
export const typesLookup: Map<NotificationType, string> = new Map([
    ['postViolation', 'Post Violation'],
    ['profileViolation', 'Profile Violation'],
]);

export interface Notification<TUser = string, TPost = string> {
    _id: string;
    userId: TUser;
    postId?: TPost;
    reason: string;
    type: NotificationType;
    deletedPost: boolean;
    createdAt: Date;
}

export type NotificationWithUser = Notification<User>;
export type NotificationWithPost = Notification<string, Post>;
export type NotificationWithUserAndPost = Notification<User, Post>;
