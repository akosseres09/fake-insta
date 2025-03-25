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
            (authError: string | null, user: typeof User) => {
                if (authError) {
                    res.status(500).send(authError);
                } else {
                    if (!user) {
                        res.status(400).send('User not found!');
                    } else {
                        req.login(user, (loginError: string | null) => {
                            if (loginError) {
                                res.status(500).send('Internal server error');
                            } else {
                                res.status(200).send(user);
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

        const response = {
            success: false,
            error: null,
        };
        user.save()
            .then((user) => {
                response.success = true;
                res.status(200).send(response);
            })
            .catch((error) => {
                response.error = error;
                res.status(500).send(response);
            });
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
