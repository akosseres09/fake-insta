import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../model/User';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user/user.service';
import { SnackbarService } from '../../snackbar/snackbar.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-list-profile',
    imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
    templateUrl: './list-profile.component.html',
    styleUrl: './list-profile.component.scss',
})
export class ListProfileComponent implements OnInit {
    @Input() isLoading?: boolean;
    @Input() filteredUsers?: Array<User>;
    @Input() showMore: boolean = true;
    @Input() user?: User;
    currentUser?: User;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private snackbar: SnackbarService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.currentUser = this.userService.getCurrentUser();
    }

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

    deleteUser(id: string, index: number) {
        this.userService.deleteUser(id).subscribe({
            next: (res) => {
                if (res.logout) {
                    this.authService.logout().subscribe({
                        next: (response) => {
                            localStorage.removeItem('user');
                            this.router.navigateByUrl('/auth/login');
                        },
                        error: (error) => {
                            console.error(error);
                        },
                    });
                } else {
                    this.snackbar.openSnackBar('Deleted User', [
                        'snackbar-success',
                    ]);
                    this.filteredUsers?.splice(index, 1);
                }
            },
            error: (err) => {
                console.error(err);
                this.snackbar.openSnackBar('Error Deleting User', [
                    'snackbar-error',
                ]);
            },
        });
    }
}
