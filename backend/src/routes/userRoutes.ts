import { Router } from 'express';
import { Request, Response } from 'express';
import { User } from '../model/User';
import { Post } from '../model/Post';
import upload from '../middlewares/multer';
import { USER_PUBLIC_FIELDS } from '../constants/constants';

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
            const { id, username, email, inArray } = req.query;

            const filter: any = {};

            if (id) filter._id = id;
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

            users = await User.find(filter).select([USER_PUBLIC_FIELDS]);

            if (users) {
                if (!inArray && users.length === 1) {
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
            res.status(500).send({
                success: false,
                result: 'Internal server error!',
            });
        }
    });

    router.get('/userProfile/:id', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }
        try {
            const userId = req.params.id;

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

            const posts = await Post.find({ userId: userId }).sort({
                createdAt: -1,
            });
            res.status(200).send({
                success: true,
                result: {
                    user: user,
                    posts: posts,
                },
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                result: 'Internal server error',
            });
        }
    });

    router.post(
        '/update/:id',
        upload.single('media'),
        async (req: Request, res: Response) => {
            if (!req.isAuthenticated()) {
                res.status(400).send({
                    error: 'User not authenticated',
                });
                return;
            }

            const userId = req.params.id;

            if (userId !== req.user) {
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

                if (user) {
                    if (req.file && req.file.path) {
                        user.profilePictureUrl = req.file.path;
                    }

                    if (req.body.username) {
                        user.username = req.body.username;
                    }

                    if (req.body.email) {
                        user.email = req.body.email;
                    }

                    user.name.first = req.body.first;
                    user.name.last = req.body.last;
                    user.bio = req.body.bio;

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
                } else {
                    res.status(404).send({
                        success: false,
                        result: 'User not found',
                    });
                }
            } catch (error) {
                res.status(500).send({
                    success: false,
                    result: 'Internal server error',
                });
            }
        }
    );

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
            const action = req.body.action; // 'follow | 'unfollow'

            if (otherUserId === currentUserId) {
                res.status(400).send({
                    success: false,
                    result: 'Can not follow user!',
                });
                return;
            }

            if (!['follow', 'unfollow'].includes(action)) {
                res.status(400).send({
                    success: false,
                    result: 'Invalid action',
                });
                return;
            }

            const [currentUser, otherUser] = await Promise.all([
                User.findById(currentUserId).select([USER_PUBLIC_FIELDS]),
                User.findById(otherUserId).select([USER_PUBLIC_FIELDS]),
            ]);

            if (!currentUser) {
                res.status(400).send({
                    success: false,
                    result: 'No User found!',
                });
                return;
            }

            if (!otherUser) {
                res.status(400).send({
                    success: false,
                    result: 'Can not follow user!',
                });
                return;
            }

            if (
                otherUser.followers.includes(currentUserId) ||
                currentUser.following.includes(otherUserId)
            ) {
                res.status(400).send({
                    success: false,
                    result: 'Already following user',
                });
                return;
            }

            currentUser.following.push(otherUserId);
            otherUser.followers.push(currentUserId);

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
            res.status(500).send({
                success: false,
                result: 'Internal server error!',
            });
        }
    });

    router.post('/unfollow', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const userId = req.user as string;
            const otherUserId = req.body.otherUser;

            if (otherUserId === userId) {
                res.status(400).send({
                    success: false,
                    result: 'Can not unfollow user!',
                });
                return;
            }

            const user = await User.findById(userId).select([
                'username',
                'name',
                'followers',
                'following',
                'isAdmin',
                'bio',
                'profilePictureUrl',
                'email',
            ]);

            if (!user) {
                res.status(400).send({
                    success: false,
                    result: 'No User found!',
                });
                return;
            }

            const otherUser = await User.findById(otherUserId).select([
                'username',
                'name',
                'followers',
                'following',
                'isAdmin',
                'bio',
                'profilePictureUrl',
                'email',
            ]);

            if (!otherUser) {
                res.status(400).send({
                    success: false,
                    result: 'Can not follow user!',
                });
                return;
            }

            if (
                !otherUser.followers.includes(userId) ||
                !user.following.includes(otherUserId)
            ) {
                res.status(400).send({
                    success: false,
                    result: 'Can not unfollow user!',
                });
                return;
            }

            // removing follow with filtering
            // id.toString returns mongodb ObjectId as a string

            user.following = user.following.filter(
                (id) => id.toString() !== otherUserId
            );
            otherUser.followers = otherUser.followers.filter(
                (id) => id.toString() !== userId
            );

            const response =
                (await otherUser.updateOne(otherUser)) &&
                (await user.updateOne(user));

            if (response) {
                res.status(200).send({
                    success: true,
                    result: {
                        user: user,
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
            res.status(500).send({
                success: false,
                result: 'Internal server error!',
            });
        }
    });
    return router;
};
