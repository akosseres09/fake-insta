import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    name: {
        first: string;
        last: string;
    };
    bio?: string;
    profilePictureUrl?: string;
    isAdmin: boolean;
    followers: [
        {
            id: string;
        }
    ];
    following: [
        {
            id: string;
        }
    ];

    comparePassword: (
        candidatePassword: string,
        callback: (error: Error | null, isMatch: boolean) => void
    ) => void;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
    },
    bio: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    profilePictureUrl: { type: String, default: '' },
    followers: [{ id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
    following: [{ id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
});

UserSchema.pre<IUser>('save', function (next) {
    const user = this;

    bcrypt.genSalt(SALT_FACTOR, (genSaltError, salt) => {
        if (genSaltError) {
            return next(genSaltError);
        }

        bcrypt.hash(user.password, salt, (hashErr, encrypted) => {
            if (hashErr) {
                return next(hashErr);
            }
            user.password = encrypted;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (
    candidatePassword: string,
    callback: (error: Error | null, isMatch: boolean) => void
): void {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
        if (error) {
            callback(error, false);
        }
        callback(null, isMatch);
    });
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
