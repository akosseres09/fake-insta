import { Router } from 'express';
import { configureRoutes } from '../routes';
import passport from 'passport';

// Mock all route modules
jest.mock('../authRoutes', () => ({
    authRoutes: jest.fn(() => {
        const router = Router();
        return router;
    })
}));

jest.mock('../userRoutes', () => ({
    userRoutes: jest.fn(() => {
        const router = Router();
        return router;
    })
}));

jest.mock('../postRoutes', () => ({
    postRoutes: jest.fn(() => {
        const router = Router();
        return router;
    })
}));

jest.mock('../likeRoutes', () => ({
    likeRoutes: jest.fn(() => {
        const router = Router();
        return router;
    })
}));

jest.mock('../commentRoutes', () => ({
    commentRoutes: jest.fn(() => {
        const router = Router();
        return router;
    })
}));

jest.mock('../notificationRoutes', () => ({
    notificationRoutes: jest.fn(() => {
        const router = Router();
        return router;
    })
}));

describe('configureRoutes', () => {
    it('should return a router instance', () => {
        const router = Router();
        const configuredRouter = configureRoutes(passport, router);

        expect(configuredRouter).toBeDefined();
        expect(typeof configuredRouter).toBe('function');
    });

    it('should configure all route modules', () => {
        const { authRoutes } = require('../authRoutes');
        const { userRoutes } = require('../userRoutes');
        const { postRoutes } = require('../postRoutes');
        const { likeRoutes } = require('../likeRoutes');
        const { commentRoutes } = require('../commentRoutes');
        const { notificationRoutes } = require('../notificationRoutes');

        const router = Router();
        configureRoutes(passport, router);

        expect(authRoutes).toHaveBeenCalledWith(passport);
        expect(userRoutes).toHaveBeenCalled();
        expect(postRoutes).toHaveBeenCalled();
        expect(likeRoutes).toHaveBeenCalled();
        expect(commentRoutes).toHaveBeenCalled();
        expect(notificationRoutes).toHaveBeenCalled();
    });
});
