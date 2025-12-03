import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import cors from 'cors';
import mongoose from 'mongoose';
import { configurePassport } from './passport/passport';
import { configureRoutes } from './routes/routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const mongoConnectionUrl = process.env.mongodb_connection_url || '';

mongoose
    .connect(mongoConnectionUrl)
    .then((_) => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
        return;
    });

const whiteList = ['*', 'http://localhost:4200'];
const corsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allowed?: boolean) => void
    ) => {
        if (
            whiteList.indexOf(origin!) !== -1 ||
            whiteList.indexOf('*') !== -1
        ) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

const sessionOptions: expressSession.SessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false
};

app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

// Healthcheck endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

app.use(configureRoutes(passport, express.Router()));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
