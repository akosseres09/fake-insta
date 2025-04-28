import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { User } from '../../shared/model/User';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IResponse } from '../../shared/model/Response';
import { UserService } from '../../shared/services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-edit',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatTooltipModule,
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit, OnDestroy {
    profileForm?: FormGroup;
    profilePicturePreview?: string;
    selectedProfilePicture?: File;
    isSubmitting = false;
    user?: User;
    userUpdateSubscription?: Subscription;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private router: Router,
        private snackBar: SnackbarService
    ) {}

    ngOnInit(): void {
        this.user = this.userService.getCurrentUser();
        this.profileForm = this.fb.group({
            _id: [this.user?._id, [Validators.required]],
            name: this.fb.group({
                first: [this.user?.name.first],
                last: [this.user?.name.last],
            }),
            username: [this.user?.username, [Validators.required]],
            email: [this.user?.email, [Validators.required, Validators.email]],
            bio: [this.user?.bio, [Validators.maxLength(150)]],
        });

        this.profilePicturePreview = `url(${this.user?.profilePictureUrl})`;
    }

    onProfilePictureSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            // Check if file is an image
            if (!file.type.match('image/*')) {
                this.snackBar.openSnackBar('Please select an image file', [
                    'snackbar-error',
                ]);
                return;
            }

            this.selectedProfilePicture = file;

            // Create a preview
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.profilePicturePreview = `url(${e.target.result})`;
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        if (!this.profileForm?.valid) {
            return;
        }

        this.isSubmitting = true;
        const form: FormData = new FormData();
        for (const key in this.profileForm?.controls) {
            if (key === 'name') {
                form.append(
                    'first',
                    this.profileForm?.get('name.first')?.value
                );
                form.append('last', this.profileForm?.get('name.last')?.value);
            }
            form.append(key, this.profileForm?.get(key)?.value);
            console.log(key, this.profileForm?.get(key)?.value);
        }
        form.append('media', this.selectedProfilePicture as Blob);
        form.append('userId', this.user?._id as string);

        this.userUpdateSubscription = this.userService
            .updateUser(form)
            .subscribe({
                next: (res: IResponse<User | string>) => {
                    this.isSubmitting = false;
                    this.snackBar.openSnackBar('Profile updated successfully!');
                    const user: User = res.result as User;
                    this.userService.setUser(user);
                    this.router.navigateByUrl('/profile/' + user._id);
                },
                error: (error) => {
                    console.log(error);
                    this.isSubmitting = false;
                    this.snackBar.openSnackBar(error.error, ['snackbar-error']);
                },
            });
    }

    cancel(): void {
        this.router.navigateByUrl('/profile/' + this.user?._id);
    }

    ngOnDestroy(): void {
        this.userUpdateSubscription?.unsubscribe();
    }
}
