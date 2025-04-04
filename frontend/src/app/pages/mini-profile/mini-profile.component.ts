import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../shared/model/User';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mini-profile',
    imports: [CommonModule],
    templateUrl: './mini-profile.component.html',
    styleUrl: './mini-profile.component.scss',
})
export class MiniProfileComponent implements OnInit, OnDestroy {
    userSubscription: Subscription | null = null;
    user: User | null = null;
    avatar: string | null = 'https://i.pravatar.cc/150?img=1';
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.userSubscription = this.authService.user$.subscribe({
            next: (user) => {
                this.user = user;
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }
}
