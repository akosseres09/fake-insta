import { Request, Response, Router } from 'express';
import { User } from '../model/User';
import { Post } from '../model/Post';
import { Like } from '../model/Like';
import { USER_PUBLIC_FIELDS } from '../constants/constants';
import multer from 'multer';

export const likeRoutes = (): Router => {
    const router: Router = Router();
    const upload = multer();

    router.get('/like', async (req: Request, res: Response) => {
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
            const populatableFields = ['userId', 'postId'];

            if (userId) {
                filters.userId = userId;
            }

            if (postId) {
                filters.postId = postId;
            }

            for (const field of populateFields) {
                if (!populatableFields.includes(field)) {
                    res.status(400).send({
                        success: false,
                        result: `Invalid populate field: ${field}`,
                    });
                    return;
                }
            }

            const likes = await Like.find(filters)
                .populate(
                    populateFields,
                    populateFields.includes('userId')
                        ? USER_PUBLIC_FIELDS
                        : null
                )
                .sort({
                    createdAt: -1,
                });

            if (likes) {
                res.status(200).send({
                    success: true,
                    result: likes,
                });
            } else {
                res.status(400).send({
                    success: false,
                    result: 'Error fetching likes!',
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

    //create a like
    router.post('/like', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const { postId, userId, action } = req.body;

            if (userId !== req.user) {
                res.status(400).send({
                    success: false,
                    result: 'User not authorized',
                });
                return;
            }

            if (!['unlike', 'like'].includes(action)) {
                res.status(400).send({
                    success: false,
                    result: 'Invalid action',
                });
                return;
            }

            const [user, post] = await Promise.all([
                User.findById(userId),
                Post.findById(postId),
            ]);

            if (!user || !post) {
                res.status(400).send({
                    success: false,
                    result: 'Error finding user or post',
                });
                return;
            }

            if (action === 'like') {
                if (post.likes.includes(userId)) {
                    res.status(400).send({
                        success: false,
                        result: 'User already liked the post',
                    });
                    return;
                }
                const like = new Like({
                    userId: user._id,
                    postId: post._id,
                });

                const response = await like.save();
                if (response) {
                    post.likes.push(userId);
                    await post.updateOne(post);
                    res.status(200).send({
                        success: true,
                        result: post,
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        result: 'Error liking post!',
                    });
                }
            } else if (action === 'unlike') {
                if (!post.likes.includes(userId)) {
                    res.status(400).send({
                        success: false,
                        result: 'User has not liked the post',
                    });
                    return;
                }
                const like = await Like.findOneAndDelete({
                    userId: user._id,
                    postId: post._id,
                });

                if (like) {
                    post.likes = post.likes.filter(
                        (id) => id.toString() !== userId
                    );
                    await post.updateOne(post);
                    res.status(200).send({
                        success: true,
                        result: post,
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        result: 'Error unliking post!',
                    });
                }
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
