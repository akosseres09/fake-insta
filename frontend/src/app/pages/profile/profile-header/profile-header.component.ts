import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../shared/model/User';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {
    AuthService,
    FollowResponse,
} from '../../../shared/services/auth/auth.service';

@Component({
    selector: 'app-profile-header',
    imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
    templateUrl: './profile-header.component.html',
    styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent implements OnInit {
    @Input() user?: User;
    @Input() postsCount?: number;
    @Input() isSameUser?: boolean;
    @Input() currentUser?: User;
    isFollowing?: boolean;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.isFollowing = this.user?.followers.includes(
            this.currentUser?._id as string
        );
    }

    follow() {
        const data = {
            user: this.currentUser?._id,
            otherUser: this.user?._id,
        };

        this.authService.follow(data).subscribe({
            next: (data: FollowResponse) => {
                const currentUser: User = data.result.user; //logged in user
                const queriedUser: User = data.result.otherUser; //queried user
                this.authService.setUser(currentUser); //setting user in authservice
                this.user = queriedUser; //setting user so ui updates
                this.isFollowing = true;
            },
            error: (err) => {
                console.error(err.result);
            },
        });
    }

    unfollow() {
        const data = {
            otherUser: this.user?._id,
            user: this.currentUser?._id,
        };
        this.authService.unfollow(data).subscribe({
            next: (data: FollowResponse) => {
                const currentUser: User = data.result.user;
                const queriedUser: User = data.result.otherUser;
                this.authService.setUser(currentUser);
                this.user = queriedUser;
                this.isFollowing = false;
            },
            error: (err) => {
                console.error(err);
            },
        });
    }
}
