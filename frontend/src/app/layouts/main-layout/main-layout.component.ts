import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterNavComponent } from '../../pages/footer-nav/footer-nav.component';
import { SidebarComponent } from '../../pages/sidebar/sidebar.component';
import { AuthService } from '../../shared/auth/auth.service';
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

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.userSubscription = this.authService
            .getUser('67e1726d3964575fd8451940')
            .subscribe((user) => {
                this.user = user as User;
            });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }
}
