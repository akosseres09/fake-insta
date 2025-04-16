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

    constructor(private userService: UserService) {}

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

    follow() {
        const data = {
            user: this.currentUser?._id,
            otherUser: this.user?._id,
        };

        this.userService.follow(data).subscribe({
            next: (data: FollowResponse) => {
                const currentUser: User = data.result.user; //logged in user
                const queriedUser: User = data.result.otherUser; //queried user
                this.userService.setUser(currentUser); //setting user in authservice
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
        this.userService.unfollow(data).subscribe({
            next: (data: FollowResponse) => {
                const currentUser: User = data.result.user;
                const queriedUser: User = data.result.otherUser;
                this.userService.setUser(currentUser);
                this.user = queriedUser;
                this.isFollowing = false;
            },
            error: (err) => {
                console.error(err);
            },
        });
    }
}
