import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { User } from '../../model/User';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user/user.service';
import { SnackbarService } from '../../snackbar/snackbar.service';

@Component({
    selector: 'app-list-profile',
    imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
    templateUrl: './list-profile.component.html',
    styleUrl: './list-profile.component.scss',
})
export class ListProfileComponent {
    @Input() isLoading?: boolean;
    @Input() filteredUsers?: Array<User>;
    @Input() showMore: boolean = true;
    @Input() user?: User;

    constructor(
        private userService: UserService,
        private snackbar: SnackbarService
    ) {}

    isFollowing(user: User) {
        return this.user?.following.includes(user?._id as string);
    }

    toggleFollow(id: string, action: 'follow' | 'unfollow', index: number) {
        const data = {
            otherUser: id,
            action: action,
        };
        const isFollow = action === 'follow';
        this.userService.follow(data).subscribe({
            next: (res) => {
                this.userService.setUser(res.result.user);
                this.user = res.result.user;
                this.filteredUsers![index] = res.result.otherUser;
                this.snackbar.openSnackBar(
                    isFollow ? 'Followed User' : 'Unfollowed User'
                );
            },
            error: (err) => {
                console.error(err);
                this.snackbar.openSnackBar(
                    isFollow
                        ? 'Error Following User'
                        : 'Error Unfollowing User',
                    ['snackbar-error']
                );
            },
        });
    }
}
