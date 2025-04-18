import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { User } from '../../shared/model/User';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { ProfileComponent } from "./profile/profile.component";

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ProfileComponent
],
    templateUrl: `./search.component.html`,
    styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
    searchControl = new FormControl('');
    user?: User;
    filteredUsers: Array<User> = [];
    usersSubscription?: Subscription;
    currentUserSubscription?: Subscription;
    isLoading = false;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.user = this.userService.getCurrentUser();

        this.searchControl.valueChanges
            .pipe(
                tap((val) => {
                    this.isLoading = true;
                })
            )
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe({
                next: (value) => {
                    this.searchUsers(value as string);
                },
                error: (error) => {
                    console.error(error);
                    this.searchUsers('');
                },
            });
    }

    searchUsers(query: string): void {
        if (query === '') {
            this.filteredUsers = [];
            this.isLoading = false;
            return;
        }
        this.userService.getUsersBySearch(query).subscribe({
            next: (respone) => {
                this.filteredUsers = respone.result;
                this.isLoading = false;
            },
            error: (error) => {
                console.error(error);
                this.isLoading = false;
            },
        });
    }

    clearSearch(): void {
        this.searchControl.setValue('');
        this.filteredUsers = [];
    }

    toggleFollow(userId: string): void {}

    isFollowing(user: User) {
        return user?.following.includes(this.user?._id as string);
    }
}
