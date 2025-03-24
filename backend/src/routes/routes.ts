import { NextFunction, Request, Response, Router } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../model/User';

export const configureRoutes = (
    passport: PassportStatic,
    router: Router
): Router => {
    router.get('/user', (req: Request, res: Response) => {
        const query = User.find();
        query
            .then((users) => {
                console.log(users);
                res.status(200).send(users);
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
        const first = req.body.name.first;
        const last = req.body.name.last;

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
                res.status(200).send(user);
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    });

    return router;
};
