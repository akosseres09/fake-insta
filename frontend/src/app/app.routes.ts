import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'app/feed',
    },
    {
        path: 'app',
        loadComponent: () =>
            import('./layouts/main-layout/main-layout.component').then(
                (c) => c.MainLayoutComponent
            ),
        children: [
            {
                path: 'feed',
                loadComponent: () =>
                    import('./pages/feed/feed.component').then(
                        (c) => c.FeedComponent
                    ),
            },
            {
                path: 'profile',
                loadComponent: () =>
                    import('./pages/profile/profile.component').then(
                        (c) => c.ProfileComponent
                    ),
            },
        ],
    },
    {
        path: 'auth',
        loadComponent: () =>
            import('./layouts/auth-layout/auth-layout.component').then(
                (c) => c.AuthLayoutComponent
            ),
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/login/login.component').then(
                        (c) => c.LoginComponent
                    ),
            },
            {
                path: 'register',
                loadChildren: () =>
                    import('./pages/signup/signup.component').then(
                        (c) => c.SignupComponent
                    ),
            },
        ],
    },
    {
        path: '**',
        loadComponent: () =>
            import('./pages/not-found/not-found.component').then(
                (c) => c.NotFoundComponent
            ),
    },
];
