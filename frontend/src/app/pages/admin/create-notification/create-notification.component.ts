import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../../shared/services/user/user.service';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
    MatAutocompleteModule,
    MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { User } from '../../../shared/model/User';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { typesLookup } from '../../../shared/model/Notification';
import { MatInputModule } from '@angular/material/input';
import {
    debounceTime,
    distinctUntilChanged,
    of,
    Subscription,
    switchMap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../../shared/model/Post';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
    selector: 'app-create-notification',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatSelectModule,
        CommonModule,
        MatCardModule,
    ],
    templateUrl: './create-notification.component.html',
    styleUrl: './create-notification.component.scss',
})
export class CreateNotificationComponent implements OnDestroy {
    notificationForm: FormGroup;
    filteredUsers: Array<User> = [];
    selectedUser: User | null = null;
    selectedPost?: Post;
    posts: Array<Post> = [];
    isLoading = false;
    searchTerm = '';
    types = typesLookup;

    notiFormTypeSubscription?: Subscription;
    notiFormNameSubscription?: Subscription;
    notiCreateSubscription?: Subscription;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private notiService: NotificationService,
        private snackBar: SnackbarService
    ) {
        this.notificationForm = this.fb.group({
            username: ['', Validators.required],
            type: ['userViolation', Validators.required],
            postId: [''],
            reason: ['', Validators.required],
        });

        this.notiFormTypeSubscription = this.notificationForm
            .get('type')
            ?.valueChanges.subscribe((type) => {
                const postIdControl = this.notificationForm.get('postId');
                if (type === 'postViolation') {
                    postIdControl?.setValidators(Validators.required);
                } else {
                    postIdControl?.clearValidators();
                    this.selectedPost = undefined;
                }
                postIdControl?.updateValueAndValidity();
            });

        this.notiFormNameSubscription = this.notificationForm
            .get('username')
            ?.valueChanges.pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((value) => {
                    if (typeof value === 'string') {
                        this.searchTerm = value.trim();
                        if (this.searchTerm) {
                            this.isLoading = true;
                            const data = {
                                username: this.searchTerm,
                                populate: 'post',
                            };
                            return this.userService.getUsersBySearch(data);
                        }
                    }
                    return of({
                        result: [],
                    });
                })
            )
            .subscribe((users) => {
                this.filteredUsers = users.result;
                this.isLoading = false;
            });
    }

    displayUsername(user: User | null): string {
        return user ? user.username : '';
    }

    onUserSelected(event: MatAutocompleteSelectedEvent): void {
        this.selectedUser = event.option.value;
        this.posts = this.selectedUser?.posts as Array<Post>;

        if (this.notificationForm.get('type')?.value === 'postViolation') {
            this.notificationForm.get('postId')?.setValue('');
        }
    }

    onPostSelected(event: MatSelectChange): void {
        const selectedPostId = event.value;
        this.selectedPost = this.posts.find(
            (post) => post._id === selectedPostId
        );
    }

    getThumbnail(videoUrl: string): string {
        if (!videoUrl.includes('/video/upload/')) {
            return videoUrl;
        }

        const transformedUrl = videoUrl.replace(
            '/video/upload/',
            '/video/upload/so_1,c_fill,w_300,h_300/' //so=1  start offset at 1 seconds
        );

        const lastDotIndex = transformedUrl.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            return transformedUrl.substring(0, lastDotIndex) + '.jpg';
        }

        return transformedUrl + '.jpg';
    }

    onSubmit(): void {
        if (!this.notificationForm.valid) {
            return;
        }
        const notificationData = {
            userId: this.selectedUser?._id as string,
            type: this.notificationForm.get('type')?.value,
            postId: this.selectedPost?._id as string,
            reason: this.notificationForm.get('reason')?.value,
        };

        this.notiCreateSubscription = this.notiService
            .createNotification(notificationData)
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.snackBar.openSnackBar(
                            'Notification created successfully',
                            ['snackbar-success']
                        );
                    } else {
                        this.snackBar.openSnackBar(
                            'Failed to create notification',
                            ['snackbar-error']
                        );
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.snackBar.openSnackBar(
                        'Failed to create notification',
                        ['snackbar-error']
                    );
                },
            });

        this.selectedUser = null;
    }

    ngOnDestroy(): void {
        this.notiFormTypeSubscription?.unsubscribe();
        this.notiFormNameSubscription?.unsubscribe();
        this.notiCreateSubscription?.unsubscribe();
    }
}
