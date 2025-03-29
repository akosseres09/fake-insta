import { Routes } from '@angular/router';
import { mainGuard } from './shared/guards/main/main.guard';
import { authGuard } from './shared/guards/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/feed',
    },
    {
        path: '',
        loadComponent: () =>
            import('./layouts/main-layout/main-layout.component').then(
                (c) => c.MainLayoutComponent
            ),
        canActivate: [mainGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'feed',
            },
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
            {
                path: 'settings',
                loadComponent: () =>
                    import('./pages/settings/settings.component').then(
                        (c) => c.SettingsComponent
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
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/login/login.component').then(
                        (c) => c.LoginComponent
                    ),
            },
            {
                path: 'signup',
                loadComponent: () =>
                    import('./pages/signup/signup.component').then(
                        (c) => c.SignupComponent
                    ),
            },
        ],
    },
    {
        path: '',
        loadComponent: () =>
            import('./layouts/auth-layout/auth-layout.component').then(
                (c) => c.AuthLayoutComponent
            ),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'not-found',
            },
            {
                path: 'not-found',
                loadComponent: () =>
                    import('./pages/not-found/not-found.component').then(
                        (c) => c.NotFoundComponent
                    ),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
