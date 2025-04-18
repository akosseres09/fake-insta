import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../shared/model/User';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {
    UserService,
    FollowResponse,
} from '../../../shared/services/user/user.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

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
    isFollowing?: boolean; // does the currently logged in user follow the queried user
    isUserFollowing?: boolean; // does the queried user follow the currently logged in user

    constructor(
        private userService: UserService,
        private snackbar: SnackbarService
    ) {}

    ngOnInit(): void {
        this.isFollowing = this.user?.followers.includes(
            this.currentUser?._id as string
        );

        this.isUserFollowing = this.user?.following.includes(
            this.currentUser?._id as string
        );

        console.log(this.isFollowing);
        console.log(this.isUserFollowing);
    }

    follow(action: 'follow' | 'unfollow') {
        const data = {
            user: this.currentUser?._id,
            otherUser: this.user?._id,
            action: action,
        };

        this.userService.follow(data).subscribe({
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
}
