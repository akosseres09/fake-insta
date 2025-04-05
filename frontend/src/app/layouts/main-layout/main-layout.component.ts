import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterNavComponent } from '../../pages/footer-nav/footer-nav.component';
import { SidebarComponent } from '../../pages/sidebar/sidebar.component';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../shared/model/User';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterNavComponent,
        SidebarComponent,
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit, OnDestroy {
    currentView = 'feed';

    user: User | null = null;
    userSubscription: Subscription | null = null;
    idSubscription: Subscription | null = null;
    id: string | null = null;
    logoutSubscription: Subscription | null = null;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.id = localStorage.getItem('user');
        console.log(this.id);

        if (!this.id) {
            this.idSubscription = this.authService.checkId().subscribe({
                next: (id) => {
                    this.id = id as string;
                    localStorage.setItem('user', this.id);
                },
                error: (error) => {
                    console.log(error);
                },
            });
        }

        this.userSubscription = this.authService
            .getUser(this.id as string)
            .subscribe({
                next: (user) => {
                    this.user = user as User;
                    console.log(this.user);
                },
                error: (error) => {
                    console.log(error);
                    this.router.navigateByUrl('/not-found');
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
