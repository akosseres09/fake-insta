import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../model/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {
    passport.serializeUser((user: Express.User, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: Express.User, done) => {
        done(null, user);
    });

    passport.use(
        'local',
        new Strategy((username, password, done) => {
            const query = User.findOne({ username: username });
            query
                .then((user) => {
                    if (user) {
                        user.comparePassword(password, (compareError, _) => {
                            if (compareError) {
                                done('Incorrect username or password!');
                            } else {
                                done(null, user.id);
                            }
                        });
                    } else {
                        done(null, undefined);
                    }
                })
                .catch((queryError) => {
                    done(queryError);
                });
        })
    );

    return passport;
};
