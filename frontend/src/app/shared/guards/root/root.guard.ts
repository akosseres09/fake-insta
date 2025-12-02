import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';

export const rootGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const router = inject(Router);
    const auth = inject(AuthService);

    return auth.checkauth().pipe(
        map((isAuthenticated) => {
            if (isAuthenticated) {
                router.navigateByUrl('/feed');
            } else {
                router.navigateByUrl('/auth/login');
            }
            return false;
        }),
        catchError((error) => {
            router.navigateByUrl('/auth/login');
            return of(false);
        })
    );
};
