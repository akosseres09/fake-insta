import { Request, Response, Router } from 'express';
import { User } from '../model/User';
import { Post } from '../model/Post';
import upload from '../middlewares/multer';
import {
    POST_POPOPULATE_FIELDS,
    USER_PUBLIC_FIELDS,
} from '../constants/constants';
import { Like } from '../model/Like';
import cloudinary from '../utils/cloudinary';
import { PostComment } from '../model/Comment';
import mongoose from 'mongoose';

export const postRoutes = (): Router => {
    const router: Router = Router();
    router.get('/post', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const { postId, userId, populate, inArray, follow } = req.query;
            const postFilter: any = {};
            const populateFields: Array<string> = [];

            const id = userId ?? req.user;
            const user = await User.findById(id);

            if (!user) {
                res.status(404).send({
                    success: false,
                    result: 'User not found',
                });
                return;
            }

            if (!follow) {
                const following = user.following;
                if (following.length === 0) {
                    following.push(user.id);
                }

                postFilter.userId = {
                    $in: following,
                };
            }

            if (postId) {
                postFilter._id = postId;
            }

            if (populate) {
                for (const field of (populate as string).split(',')) {
                    if (!POST_POPOPULATE_FIELDS.includes(field)) {
                        res.status(400).send({
                            success: false,
                            result: 'Invalid populate field',
                        });
                        return;
                    }
                    populateFields.push(field);
                }
            }

            let postsQuery = Post.find(postFilter)
                .sort({ createdAt: -1 })
                .populate(
                    populateFields,
                    populateFields.includes('userId')
                        ? USER_PUBLIC_FIELDS
                        : null
                );
            let posts;
            posts = await postsQuery;

            if (inArray === 'false' && posts.length === 1) {
                posts = posts[0];
            }

            if (posts) {
                res.status(200).send({
                    success: true,
                    result: posts,
                });
            } else {
                res.status(404).send({
                    success: false,
                    result: null,
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                result: 'Internal server error',
            });
        }
    });

    router.post(
        '/post',
        upload.single('media'),
        async (req: Request, res: Response) => {
            if (!req.isAuthenticated()) {
                res.status(400).send({
                    success: false,
                    result: 'User not authenticated',
                });
                return;
            }

            try {
                const { caption, altText, userId } = req.body;

                if (userId !== req.user) {
                    res.status(400).send({
                        success: false,
                        result: 'User not authorized',
                    });
                    return;
                }

                if (!req.file || !req.file.path) {
                    res.status(400).send('No file uploaded');
                    return;
                }

                const user = await User.findById(userId);

                if (!user) {
                    res.status(404).send({
                        success: false,
                        result: 'User not found',
                    });
                    return;
                }

                const newPost = new Post({
                    userId: userId,
                    caption: caption,
                    altText: altText,
                    mediaUrl: req.file.path,
                    mediaType: req.file.mimetype.startsWith('video')
                        ? 'video'
                        : 'image',
                    mediaPublicId: req.file.filename,
                    likes: [],
                    comments: [],
                });

                const response = await newPost.save();

                if (response) {
                    user.posts.push(response.id);
                    await user.updateOne(user);
                    res.status(200).send({
                        success: true,
                        result: newPost,
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        result: 'Error creating post',
                    });
                }
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    success: false,
                    result: 'Internal server error',
                });
            }
        }
    );

    router.delete('/post/:id', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const userId = req.user;
            const user = await User.findById(userId); // the user who requested the delete (logged in user)

            if (!user) {
                await session.abortTransaction();
                await session.endSession();
                res.status(404).send({
                    success: false,
                    result: 'User not found',
                });
                return;
            }

            const postId = req.params.id;
            const post = await Post.findById(postId);

            if (!post) {
                await session.abortTransaction();
                await session.endSession();
                res.status(404).send({
                    success: false,
                    result: 'Post not found',
                });
                return;
            }

            if (userId !== post.userId && !user.isAdmin) {
                await session.abortTransaction();
                await session.endSession();
                res.status(403).send({
                    success: false,
                    result: 'Not authorized to delete this post',
                });
                return;
            }

            const postCreator =
                req.user === post.userId
                    ? user
                    : await User.findById(post.userId);

            if (!postCreator) {
                await session.abortTransaction();
                await session.endSession();
                res.status(404).send({
                    success: false,
                    result: 'Post creator not found',
                });
                return;
            }

            const cloudRes = await cloudinary.uploader.destroy(
                post.mediaPublicId
            );

            if (cloudRes.result !== 'ok') {
                await session.abortTransaction();
                await session.endSession();
                res.status(400).send({
                    success: false,
                    result: 'Error deleting media from cloud',
                });
                return;
            }

            postCreator.posts = postCreator.posts.filter(
                (postId: string) => postId !== post.id.toString()
            );

            const response =
                (await postCreator.updateOne(postCreator)) &&
                (await Like.deleteMany({ postId: postId })) &&
                (await PostComment.deleteMany({ postId: postId })) &&
                (await Post.deleteOne({ _id: postId }));

            if (!response) {
                await session.abortTransaction();
                await session.endSession();
                res.status(400).send({
                    success: false,
                    result: 'Error deleting post',
                });
                return;
            }

            await session.commitTransaction();
            await session.endSession();
            res.status(200).send({
                success: true,
                result: 'Post deleted successfully',
            });
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            console.log(error);
            res.status(500).send({
                success: false,
                result: 'Internal server error',
            });
        }
    });

    return router;
};
