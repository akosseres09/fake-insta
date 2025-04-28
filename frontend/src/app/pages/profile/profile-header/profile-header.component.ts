import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../shared/model/User';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {
    UserService,
    FollowResponse,
} from '../../../shared/services/user/user.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationWithPost } from '../../../shared/model/Notification';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-profile-header',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        MatBadgeModule,
        MatMenuModule,
        MatListModule,
    ],
    templateUrl: './profile-header.component.html',
    styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
    @Input() user?: User;
    @Input() postsCount?: number;
    @Input() isSameUser?: boolean;
    @Input() currentUser?: User;
    isFollowing?: boolean; // does the currently logged in user follow the queried user
    isUserFollowing?: boolean; // does the queried user follow the currently logged in user
    notifications: Array<NotificationWithPost> = [];
    getNotificationSubscription?: Subscription;
    setNotificationSubscription?: Subscription;
    followSubscription?: Subscription;

    constructor(
        private userService: UserService,
        private snackbar: SnackbarService,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.isFollowing = this.user?.followers.includes(
            this.currentUser?._id as string
        );

        this.isUserFollowing = this.user?.following.includes(
            this.currentUser?._id as string
        );

        this.getNotificationSubscription = this.notificationService
            .getUnseenNotifications(this.currentUser?._id as string)
            .subscribe({
                next: (data) => {
                    this.notifications = data.result;
                    console.log(this.notifications);
                },
                error: (err) => {
                    console.error(err.result);
                    this.snackbar.openSnackBar(
                        'Failed to fetch notifications',
                        ['snackbar-error']
                    );
                },
            });
    }

    follow(action: 'follow' | 'unfollow') {
        const data = {
            user: this.currentUser?._id,
            otherUser: this.user?._id,
            action: action,
        };

        this.followSubscription = this.userService.follow(data).subscribe({
            next: (data: FollowResponse) => {
                this.userService.setUser(data.result.user); //setting user in authservice
                this.user = data.result.otherUser; //setting user so ui updates
                this.snackbar.openSnackBar(
                    this.isFollowing ? 'Unfollowed User' : 'Followed User'
                );
                this.isFollowing = !this.isFollowing; //toggle follow state
            },
            error: (err) => {
                console.error(err.result);
                this.snackbar.openSnackBar(
                    this.isFollowing ? 'Unfollow Failed' : 'Follow Failed',
                    ['snackbar-error']
                );
            },
        });
    }

    clearNotifications() {
        this.setNotificationSubscription = this.notificationService
            .setNotificationsSeen(this.currentUser?._id as string)
            .subscribe({
                next: (data) => {
                    this.notifications = [];
                    this.snackbar.openSnackBar('Notifications cleared', [
                        'snackbar-success',
                    ]);
                },
                error: (err) => {
                    console.error(err.result);
                    this.snackbar.openSnackBar(
                        'Failed to clear notifications',
                        ['snackbar-error']
                    );
                },
            });
    }

    ngOnDestroy(): void {
        this.getNotificationSubscription?.unsubscribe();
        this.setNotificationSubscription?.unsubscribe();
        this.followSubscription?.unsubscribe();
    }
}
