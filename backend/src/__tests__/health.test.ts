import express, { Express } from 'express';
import request from 'supertest';

describe('Healthcheck Endpoint', () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });
    });

    it('should return 200 and status ok', async () => {
        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });

    it('should have correct content-type', async () => {
        const response = await request(app).get('/health');

        expect(response.headers['content-type']).toMatch(/json/);
    });
});
