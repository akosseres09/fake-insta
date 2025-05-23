import { Request, Response, Router } from 'express';
import { USER_PUBLIC_FIELDS } from '../constants/constants';
import { Notification, types } from '../model/Notification';
import { User } from '../model/User';
import { Post } from '../model/Post';
import mongoose from 'mongoose';

export const notificationRoutes = (): Router => {
    const router: Router = Router();

    router.get('/notification', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const { userId, postId, seen, populate } = req.query;
            const populateFields: Array<string> =
                populate?.toString().split(',') || [];
            const allowedPopulateFields = ['userId', 'postId'];
            const filters: any = {};

            if (userId) {
                filters.userId = userId;
            }
            if (postId) {
                filters.postId = postId;
            }
            if (seen) {
                filters.seenByUser = seen === 'true';
            }

            if (populateFields) {
                for (const field of populateFields) {
                    if (!allowedPopulateFields.includes(field)) {
                        res.status(400).send({
                            success: false,
                            result: 'Invalid populate field',
                        });
                        return;
                    }
                }
            }

            const notifications = await Notification.find(filters).populate(
                populateFields,
                USER_PUBLIC_FIELDS
            );

            res.status(200).send({
                success: true,
                result: notifications,
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                result: 'Internal server error',
            });
        }
    });

    router.post(
        '/notification/:userId',
        async (req: Request, res: Response) => {
            if (!req.isAuthenticated()) {
                res.status(400).send({
                    success: false,
                    result: 'User not authenticated',
                });
                return;
            }

            const session = await mongoose.startSession();
            await session.startTransaction();

            try {
                const { userId } = req.params;
                const currentUserId = req.user as string;

                if (userId !== currentUserId) {
                    await session.abortTransaction();
                    await session.endSession();
                    res.status(400).send({
                        success: false,
                        result: 'User not authorized',
                    });
                    return;
                }

                const user = await User.findById(req.user);

                if (!user) {
                    await session.abortTransaction();
                    await session.endSession();
                    res.status(400).send({
                        success: false,
                        result: 'User not found',
                    });
                    return;
                }

                const notifications = await Notification.find({
                    userId: userId,
                });

                if (!notifications) {
                    await session.abortTransaction();
                    await session.endSession();
                    res.status(404).send({
                        success: false,
                        result: 'No notifications found',
                    });
                    return;
                }

                for (const notification of notifications) {
                    notification.seenByUser = true;
                    await notification.save();
                }

                await session.commitTransaction();
                await session.endSession();
                res.status(200).send({
                    success: true,
                    result: notifications,
                });
            } catch (error) {
                console.error(error);
                res.status(500).send({
                    success: false,
                    result: 'Internal server error',
                });
            }
        }
    );

    router.post('/notification', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        const user = await User.findById(req.user);

        if (!user || !user.isAdmin) {
            res.status(400).send({
                success: false,
                result: 'User not authorized',
            });
            return;
        }

        try {
            const { userId, postId, reason, type, deleted } = req.body;

            if (userId) {
                const notiUser = await User.findById(userId);
                if (!notiUser) {
                    res.status(400).send({
                        success: false,
                        result: 'User not found',
                    });
                    return;
                }

                if (postId && !notiUser.posts.includes(postId)) {
                    res.status(400).send({
                        success: false,
                        result: 'User does not have this post',
                    });
                    return;
                }
            }

            if (postId) {
                const notiPost = await Post.findById(postId);
                if (!notiPost) {
                    res.status(400).send({
                        success: false,
                        result: 'Post not found',
                    });
                    return;
                }
            }

            if (!types.includes(type)) {
                res.status(400).send({
                    success: false,
                    result: 'Invalid notification type',
                });
                return;
            }

            const notification = new Notification({
                userId,
                postId,
                reason,
                type,
                deletedPost: deleted === 'true',
            });

            const result = await notification.save();

            if (result) {
                res.status(200).send({
                    success: true,
                    result: notification,
                });
            } else {
                res.status(400).send({
                    success: false,
                    result: 'Error creating notification',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                result: 'Internal server error',
            });
        }
    });

    return router;
};
