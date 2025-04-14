import { NextFunction, Request, Response, Router } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import upload from '../middlewares/multer';
import { Post } from '../model/Post';

export const configureRoutes = (
    passport: PassportStatic,
    router: Router
): Router => {
    // Authentication routes
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            'local',
            (authError: string | null, userId: string) => {
                if (authError) {
                    res.status(500).send(authError);
                } else {
                    if (!userId) {
                        res.status(400).send('User not found!');
                    } else {
                        req.login(userId, (loginError: string | null) => {
                            if (loginError) {
                                res.status(500).send('Internal server error');
                            } else {
                                res.status(200).send(userId);
                            }
                        });
                    }
                }
            }
        )(req, res, next);
    });

    router.post('/register', async (req: Request, res: Response) => {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const first = req.body.first;
        const last = req.body.last;

        const user = new User({
            email: email,
            username: username,
            password: password,
            name: {
                first: first,
                last: last,
            },
            followers: [],
            following: [],
        });

        try {
            const result = await user.save();

            if (result) {
                res.status(200).send(true);
            } else {
                res.status(400).send(false);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(false);
        }
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((logoutError) => {
                if (logoutError) {
                    res.status(500).send('Internal server error');
                }
                res.status(200).send('Logged out');
            });
        } else {
            res.status(400).send('Not logged in');
        }
    });

    //Authentication routes end

    // User routes

    router.get('/user/:id', async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const user = await User.findOne({ _id: userId }).select([
                'username',
                'name',
                'followers',
                'following',
                'isAdmin',
                'bio',
                'profilePictureUrl',
                'email',
            ]);

            if (user) {
                res.status(200).send(user);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            res.status(500).send(error);
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
                    'username',
                    'name',
                    'followers',
                    'following',
                    'isAdmin',
                    'bio',
                    'profilePictureUrl',
                    'email',
                ]);

                if (user) {
                    if (req.file && req.file.path) {
                        user.profilePictureUrl = req.file.path;
                    }

                    user.name.first = req.body.first;
                    user.name.last = req.body.last;
                    user.username = req.body.username;
                    user.email = req.body.email;
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

    router.get('/checkId', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(req.user);
        } else {
            res.status(400).send(null);
        }
    });

    router.get('/checkauth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    });

    router.get('/checkAdmin', async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            try {
                const user = await User.findById(req.user);
                if (user) {
                    res.status(200).send(user.isAdmin);
                } else {
                    res.status(404).send(false);
                }
            } catch (error) {
                res.status(500).send(false);
            }
        } else {
            res.status(400).send(false);
        }
    });

    // User routes end

    // Post routes

    router.get('/posts', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            res.status(400).send({
                success: false,
                result: 'User not authenticated',
            });
            return;
        }

        try {
            const user = await User.findById(req.user);
            if (!user) {
                res.status(404).send({
                    success: false,
                    result: 'User not found',
                });
                return;
            }
            const following = user.following.map((user) => user.id);
            following.push(user.id);

            const posts = await Post.find({ userId: { $in: following } })
                .sort({ createdAt: -1 })
                .populate('userId', ['username', 'profilePictureUrl']);

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
            res.status(500).send({
                success: false,
                result: 'Internal server error',
            });
        }
    });

    router.post(
        '/createPost',
        upload.single('media'),
        async (req: Request, res: Response) => {
            try {
                const { caption, altText, userId } = req.body;
                if (!req.file || !req.file.path) {
                    res.status(400).send('No file uploaded');
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
                    likes: [],
                    comments: [],
                });

                const response = await newPost.save();

                if (response) {
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
                res.status(500).send({
                    success: false,
                    result: 'Internal server error',
                });
            }
        }
    );

    return router;
};
