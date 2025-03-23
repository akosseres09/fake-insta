import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

const whiteList = ['http://localhost:4200'];
const corsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allowed?: boolean) => void
    ) => {
        if (whiteList.indexOf(origin!) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
    const asd = [{ a: 1 }, { b: 2 }];
    res.status(200).send(asd);
});
