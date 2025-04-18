import { Router } from 'express';
import { PassportStatic } from 'passport';
import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { postRoutes } from './postRoutes';
import { likeRoutes } from './likeRoutes';

export const configureRoutes = (
    passport: PassportStatic,
    router: Router
): Router => {
    // Authentication routes
    router.use('/', authRoutes(passport));

    // User routes
    router.use('/', userRoutes());

    // Post routes
    router.use('/', postRoutes());

    // Like routes
    router.use('/', likeRoutes());

    return router;
};
