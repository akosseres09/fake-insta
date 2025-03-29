import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const auth = inject(AuthService);

    return auth.checkauth().pipe(
        map((isAuthenticated) => {
            if (isAuthenticated) {
                router.navigateByUrl('/feed');
                return false;
            } else {
                return true;
            }
        }),
        catchError((error) => {
            router.navigateByUrl('/feed');
            return of(true);
        })
    );
};
