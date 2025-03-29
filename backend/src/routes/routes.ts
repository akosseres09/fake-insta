import { NextFunction, Request, Response, Router } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../model/User';

export const configureRoutes = (
    passport: PassportStatic,
    router: Router
): Router => {
    router.get('/user/:id', (req: Request, res: Response) => {
        const userId = req.params.id;
        const query = User.findOne({ _id: userId }).select([
            'username',
            'name',
            'followers',
            'following',
            'isAdmin',
            'bio',
            'profilePictureUrl',
            'email',
        ]);
        query
            .then((user) => {
                res.status(200).send(user);
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    });

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

    router.post('/register', (req: Request, res: Response) => {
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

        user.save()
            .then((user) => {
                res.status(200).send(true);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send(false);
            });
    });

    router.get('/checkId', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(req.user);
        } else {
            res.status(400).send(null);
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

    router.get('/checkauth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    });

    return router;
};
