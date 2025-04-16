import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterNavComponent } from '../../pages/footer-nav/footer-nav.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../shared/model/User';
import { Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../shared/services/user/user.service';

@Component({
    selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterNavComponent,
        SidebarComponent,
        CommonModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit, OnDestroy {
    currentView = 'feed';

    user?: User;
    userSubscription?: Subscription;
    idSubscription?: Subscription;
    logoutSubscription?: Subscription;
    id: string | null = null;
    idObservable: Observable<string> = new Observable<string>();

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.id = localStorage.getItem('user');

        if (this.id) {
            this.idObservable = of(this.id);
        } else {
            this.idObservable = this.authService.checkId().pipe(
                tap((id) => {
                    this.id = id as string;
                    localStorage.setItem('user', this.id);
                })
            );
        }

        this.idSubscription = this.idObservable
            .pipe(
                switchMap((id) => {
                    const currentUser = this.userService.getCurrentUser();
                    if (currentUser) {
                        return of(currentUser);
                    } else {
                        return this.userService.getUser(id as string);
                    }
                })
            )
            .subscribe({
                next: (user) => {
                    this.user = user as User;
                    this.userService.setUser(this.user);
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    logout(): void {
        this.logoutSubscription = this.authService.logout().subscribe({
            next: (response) => {
                localStorage.removeItem('user');
                this.router.navigateByUrl('/auth/login');
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
        this.idSubscription?.unsubscribe();
    }
}
