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
        new Strategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username: username });

                if (!user) {
                    done(null, undefined);
                }

                user?.comparePassword(password, (compareError, isMatch) => {
                    if (compareError || !isMatch) {
                        done('Incorrect username or password!');
                    } else {
                        done(null, user.id);
                    }
                });
            } catch (error) {
                done(error);
            }
        })
    );

    return passport;
};
