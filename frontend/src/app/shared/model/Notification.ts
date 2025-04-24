export const types = ['postViolation', 'profileViolation'] as const;
export type NotificationType = (typeof types)[number];
export const typesLookup: Map<NotificationType, string> = new Map([
    ['postViolation', 'Post Violation'],
    ['profileViolation', 'Profile Violation'],
]);

export interface Notification {
    _id: string;
    userId: string;
    postId?: string;
    reason: string;
    type: NotificationType;
    deletedPost: boolean;
    createdAt: Date;
}
