import { Component, OnDestroy, type OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth/auth.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { User } from '../../shared/model/User';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IResponse } from '../../shared/model/Response';

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
    profileForm: FormGroup | null = null;
    profilePicturePreview = 'url(https://i.pravatar.cc/150?img=1)';
    selectedProfilePicture: File | null = null;
    isSubmitting = false;
    userSubscription: Subscription | null = null;
    user: User | null = null;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private snackBar: SnackbarService
    ) {}

    ngOnInit(): void {
        this.userSubscription = this.authService.user$.subscribe({
            next: (user) => {
                this.profileForm = this.fb.group({
                    _id: [user?._id, [Validators.required]],
                    name: this.fb.group({
                        first: [user?.name.first],
                        last: [user?.name.last],
                    }),
                    username: [user?.username, [Validators.required]],
                    email: [
                        user?.email,
                        [Validators.required, Validators.email],
                    ],
                    bio: [user?.bio, [Validators.maxLength(150)]],
                });
            },
            error: (error) => {
                this.snackBar.openSnackBar('Error fetching user data', [
                    'snackbar-error',
                ]);
            },
        });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
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

        // Combine form data
        const formData = new FormData();
        if (this.selectedProfilePicture) {
            formData.append('profilePictureUrl', this.selectedProfilePicture);
        }

        Object.keys(this.profileForm.value).forEach((key) => {
            formData.append(key, this.profileForm?.value[key]);
        });

        this.authService.updateUser(this.profileForm.value).subscribe({
            next: (res: IResponse<User | string>) => {
                console.log(res);
                this.isSubmitting = false;
                this.snackBar.openSnackBar('Profile updated successfully!');
                this.authService.setUser(res.result as User);
            },
            error: (error) => {
                console.log(error);
                this.isSubmitting = false;
                this.snackBar.openSnackBar(error.error, ['snackbar-error']);
            },
        });
    }

    cancel(): void {
        this.router.navigate(['/profile']);
    }
}
