import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';

export const mainGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const auth = inject(AuthService);
    const authRoutes = ['/auth/login', '/auth/signup', '/auth/not-found'];

    return auth.checkauth().pipe(
        map((isAuthenticated) => {
            if (!isAuthenticated) {
                if (authRoutes.includes(state.url)) {
                    return true;
                } else {
                    router.navigateByUrl('/auth/not-found');
                    return false;
                }
            } else {
                return true;
            }
        }),
        catchError((error) => {
            router.navigateByUrl('/auth/login');
            return of(false);
        })
    );
};
