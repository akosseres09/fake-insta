export const types = ['postViolation', 'profileViolation'] as const;
export type NotificationType = (typeof types)[number];

export interface Notification {
    _id: string;
    userId: string;
    postId?: string;
    reason: string;
    type: NotificationType;
    deletedPost: boolean;
    createdAt: Date;
}
