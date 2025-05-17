import { Router } from 'express';
import { Request, Response } from 'express';
import { User } from '../model/User';
import upload from '../middlewares/multer';
import { USER_PUBLIC_FIELDS } from '../constants/constants';
import { Post } from '../model/Post';
import cloudinary from '../utils/cloudinary';
import { Like } from '../model/Like';
import { PostComment } from '../model/Comment';
import mongoose from 'mongoose';

export const userRoutes = (): Router => {
    const router: Router = Router();
    router.get('/user', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const { id, username, email, inArray, populate } = req.query;
            const filter: any = {};

            if (id) {
                filter._id = id;
            }
            if (username)
                filter.username = {
                    $regex: username,
                    $options: 'i',
                };
            if (email)
                filter.email = {
                    $regex: email,
                    $options: 'i',
                };

            let users;
            const usersQuery = User.find(filter).select([USER_PUBLIC_FIELDS]);

            if (populate === 'post') {
                usersQuery.populate({
                    path: 'posts',
                    options: { sort: { createdAt: -1 } },
                });
            }

            users = await usersQuery;

            if (users) {
                if (inArray === 'false' && users.length === 1) {
                    users = users[0];
                }

                res.status(200).send({
                    success: true,
                    result: users,
                });
            } else {
                res.status(400).send({
                    success: false,
                    result: 'No User found!',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                result: 'Internal server error!',
            });
        }
    });

    router.post(
        '/user',
        upload.single('media'),
        async (req: Request, res: Response) => {
            if (!req.isAuthenticated()) {
                res.status(400).send({
                    error: 'User not authenticated',
                });
                return;
            }

            const { userId, username, email, first, last, bio, role } =
                req.body;

            const reqUser = await User.findById(req.user).select([
                USER_PUBLIC_FIELDS,
            ]);

            if (!reqUser) {
                res.status(404).send({
                    success: false,
                    result: 'User not found',
                });
                return;
            }

            if (userId !== req.user && !reqUser.isAdmin) {
                res.status(403).send({
                    success: false,
                    result: 'Not authorized',
                });
                return;
            }

            try {
                const user = await User.findById(userId).select([
                    USER_PUBLIC_FIELDS,
                ]);

                if (!user) {
                    res.status(404).send({
                        success: false,
                        result: 'User not found',
                    });
                    return;
                }

                if (req.file && req.file.path) {
                    user.profilePictureUrl = req.file.path;
                }

                if (username) {
                    user.username = username;
                }

                if (email) {
                    user.email = email;
                }

                if (role) {
                    user.isAdmin = role === 'admin';
                    user.role = role;
                }

                if (first) {
                    user.name.first = first;
                }

                if (last) {
                    user.name.last = last;
                }

                if (bio) {
                    user.bio = bio;
                }

                const response = await user.updateOne(user);

                if (response) {
                    res.status(200).send({
                        success: true,
                        result: user,
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        result: 'Error updating user',
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({
                    success: false,
                    result: 'Internal server error',
                });
            }
        }
    );

    router.delete('/user/:id', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        const currentUserId = req.user;
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            res.status(404).send({
                success: false,
                result: 'User not found',
            });
            return;
        }

        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).send({
                success: false,
                result: 'User not found',
            });
            return;
        }

        if (currentUserId !== userId && !currentUser.isAdmin) {
            res.status(403).send({
                success: false,
                result: 'Not authorized',
            });
            return;
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const posts = await Post.find({ userId: userId });

            // deletes all posts made by the user, including media, likes and comments
            for (const post of posts) {
                const cloudRes = await cloudinary.uploader.destroy(
                    post.mediaPublicId,
                    {
                        resource_type:
                            post.mediaType === 'video' ? 'video' : 'image',
                    }
                );
                if (cloudRes.result !== 'ok') {
                    await session.abortTransaction();
                    await session.endSession();
                    res.status(400).send({
                        success: false,
                        result: 'Error deleting post media: ' + cloudRes.result,
                    });
                    return;
                }
                await Like.deleteMany({ postId: post._id });
                await PostComment.deleteMany({ postId: post._id });
            }

            // deletes follows and followings of the user
            for (const followingId of user.following) {
                const followingUser = await User.findById(followingId);
                if (followingUser) {
                    followingUser.followers = followingUser.followers.filter(
                        (id) => id.toString() !== userId
                    );

                    if (followingUser.following.includes(userId)) {
                        followingUser.following =
                            followingUser.following.filter(
                                (id) => id.toString() !== userId
                            );
                    }

                    const updateRes = await followingUser.updateOne(
                        followingUser
                    );

                    if (!updateRes) {
                        await session.abortTransaction();
                        await session.endSession();
                        res.status(400).send({
                            success: false,
                            result: 'Error updating following user',
                        });
                        return;
                    }
                }
            }

            const likes = await Like.find({ userId: userId });
            const comments = await PostComment.find({ userId: userId });

            // deletes all likes made by the user
            for (const like of likes) {
                const p = await Post.findById(like.postId);
                if (p) {
                    p.likes = p.likes.filter((id) => {
                        return id.toString() !== userId;
                    });

                    const updateRes = await p.updateOne(p);
                    if (!updateRes) {
                        await session.abortTransaction();
                        await session.endSession();
                        res.status(400).send({
                            success: false,
                            result: 'Error updating post',
                        });
                        return;
                    }
                }
                await Like.deleteOne({ _id: like.id });
            }

            // deletes all comments made by the user
            for (const comment of comments) {
                const p = await Post.findById(comment.postId);
                if (p) {
                    p.comments = p.comments.filter((id) => {
                        return id.toString() !== userId;
                    });
                    const updateRes = await p.updateOne(p);
                    if (!updateRes) {
                        await session.abortTransaction();
                        await session.endSession();
                        res.status(400).send({
                            success: false,
                            result: 'Error updating post',
                        });
                        return;
                    }
                }
                await PostComment.deleteOne({ _id: comment.id });
            }

            const response =
                (await Post.deleteMany({ userId: userId })) &&
                (await User.deleteOne({ _id: userId }));

            if (!response) {
                await session.abortTransaction();
                await session.endSession();
                res.status(400).send({
                    success: false,
                    result: 'Error deleting user',
                });
                return;
            }
            await session.commitTransaction();
            await session.endSession();
            res.status(200).send({
                success: true,
                result: 'User deleted successfully',
                logout: currentUserId === userId,
            });
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            console.error(error);
            res.status(500).send({
                success: false,
                result: 'Internal server error',
            });
        }
    });

    // handles following/unfollowing a user
    router.post('/follow', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const currentUserId = req.user as string;
            const otherUserId = req.body.otherUser;
            const action = req.body.action; // 'follow' | 'unfollow'

            if (!['follow', 'unfollow'].includes(action)) {
                res.status(400).send({
                    success: false,
                    result: 'Invalid action',
                });
                return;
            }

            if (otherUserId === currentUserId) {
                res.status(400).send({
                    success: false,
                    result: 'Can not follow user!',
                });
                return;
            }

            const [currentUser, otherUser] = await Promise.all([
                User.findById(currentUserId).select([USER_PUBLIC_FIELDS]),
                User.findById(otherUserId).select([USER_PUBLIC_FIELDS]),
            ]);

            if (!currentUser || !otherUser) {
                res.status(400).send({
                    success: false,
                    result: 'No User found!',
                });
                return;
            }

            if (
                action === 'follow' &&
                (otherUser.followers.includes(currentUserId) ||
                    currentUser.following.includes(otherUserId))
            ) {
                res.status(400).send({
                    success: false,
                    result: 'Already following user',
                });
                return;
            }

            if (
                action === 'unfollow' &&
                (!otherUser.followers.includes(currentUserId) ||
                    !currentUser.following.includes(otherUserId))
            ) {
                res.status(400).send({
                    success: false,
                    result: 'Can not unfollow user!',
                });
                return;
            }

            if (action === 'follow') {
                currentUser.following.push(otherUserId);
                otherUser.followers.push(currentUserId);
            } else if (action === 'unfollow') {
                currentUser.following = currentUser.following.filter(
                    (id) => id.toString() !== otherUserId
                );
                otherUser.followers = otherUser.followers.filter(
                    (id) => id.toString() !== currentUserId
                );
            }

            const response =
                (await otherUser.updateOne(otherUser)) &&
                (await currentUser.updateOne(currentUser));

            if (response) {
                res.status(200).send({
                    success: true,
                    result: {
                        user: currentUser,
                        otherUser: otherUser,
                    },
                });
            } else {
                res.status(400).send({
                    success: false,
                    result: 'Something went wrong!',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                result: 'Internal server error!',
            });
        }
    });

    return router;
};
