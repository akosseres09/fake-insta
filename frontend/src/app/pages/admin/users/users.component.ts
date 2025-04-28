import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user/user.service';
import { User } from '../../../shared/model/User';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchComponent } from '../../search/search.component';

@Component({
    selector: 'app-users',
    imports: [CommonModule, MatProgressSpinnerModule, SearchComponent],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit, OnDestroy {
    users?: Array<User>;
    currentUser?: User;
    userSubscription?: Subscription;
    isLoading: boolean = true;

    constructor(
        private userService: UserService,
        private snackbar: SnackbarService
    ) {}

    ngOnInit(): void {
        this.currentUser = this.userService.getCurrentUser();
        this.userSubscription = this.userService.getAllUsers().subscribe({
            next: (data) => {
                this.isLoading = false;
                this.users = data.result.filter(
                    (user: User) => user._id !== this.currentUser?._id
                );
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
                this.snackbar.openSnackBar('Error fetching users', [
                    'snackbar-error',
                ]);
            },
        });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }
}
