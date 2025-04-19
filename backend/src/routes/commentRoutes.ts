import { Request, Response, Router } from 'express';
import { User } from '../model/User';
import { Post } from '../model/Post';
import { PostComment } from '../model/Comment';
import { USER_PUBLIC_FIELDS } from '../constants/constants';
export const commentRoutes = () => {
    const router: Router = Router();

    router.get('/comment', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const { userId, postId, populate } = req.query;
            const filters: any = {};
            const populateFields = populate
                ? (populate as string).split(',')
                : [];

            if (userId) {
                filters.userId = userId;
            }
            if (postId) {
                filters.postId = postId;
            }

            for (const field of populateFields) {
                if (!['userId', 'postId'].includes(field)) {
                    res.status(400).send({
                        success: false,
                        result: 'Invalid populate field: ' + field,
                    });
                    return;
                }
            }

            const comments = await PostComment.find(filters)
                .populate(
                    populateFields,
                    populateFields.includes('userId')
                        ? USER_PUBLIC_FIELDS
                        : null
                )
                .sort({ createdAt: -1 });

            if (comments) {
                res.status(200).send({
                    success: true,
                    result: comments,
                });
            } else {
                res.status(400).send({
                    success: false,
                    result: 'Error finding comments',
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

    router.post('/comment', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const { userId, postId, text } = req.body;
            if (!text || !userId || !postId) {
                res.status(400).send({
                    success: false,
                    result: 'Invalid data',
                });
                return;
            }

            if (userId !== req.user) {
                res.status(400).send({
                    success: false,
                    result: 'User not authorized',
                });
                return;
            }

            const [user, post] = await Promise.all([
                User.findById(userId),
                Post.findById(postId).populate('comments'),
            ]);

            if (!user || !post) {
                res.status(400).send({
                    success: false,
                    result: 'Error finding user or post',
                });
                return;
            }

            const comment = new PostComment({
                userId: user._id,
                postId: post._id,
                text: text,
            });

            const response = await comment.save();

            if (response) {
                post.comments.push(userId);
                await post.updateOne(post);
                res.status(200).send({
                    success: true,
                    result: post,
                });
            } else {
                res.status(400).send({
                    success: false,
                    result: 'Error saving comment',
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
