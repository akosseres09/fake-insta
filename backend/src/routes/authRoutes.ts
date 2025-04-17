import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { User } from '../model/User';
import { PassportStatic } from 'passport';

export const authRoutes = (passport: PassportStatic): Router => {
    const router: Router = Router();
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            'local',
            (authError: string | null, userId: string) => {
                if (authError) {
                    res.status(500).send(authError);
                } else {
                    if (!userId) {
                        res.status(400).send({
                            success: false,
                            result: 'User not found!',
                        });
                    } else {
                        req.login(userId, async (loginError: string | null) => {
                            if (loginError) {
                                res.status(500).send({
                                    success: false,
                                    result: 'Internal server error',
                                });
                            } else {
                                const user = await User.findById(userId).select(
                                    [
                                        'username',
                                        'name',
                                        'followers',
                                        'following',
                                        'isAdmin',
                                        'bio',
                                        'profilePictureUrl',
                                        'email',
                                    ]
                                );
                                res.status(200).send({
                                    success: true,
                                    result: user,
                                });
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

    return router;
};
