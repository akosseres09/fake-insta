import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const auth = inject(AuthService);

    return auth.checkAdmin().pipe(
        map((isAdmin) => {
            if (isAdmin) {
                return true;
            } else {
                router.navigateByUrl('/feed');
                return false;
            }
        }),
        catchError((error) => {
            router.navigateByUrl('/feed');
            return of(false);
        })
    );
};
