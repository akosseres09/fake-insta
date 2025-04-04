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
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { PostService } from '../../shared/services/post/post.service';
import { IBodyPost } from '../../shared/model/Post';

@Component({
    selector: 'app-create',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatStepperModule,
        MatTooltipModule,
    ],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit, OnDestroy {
    uploadForm: FormGroup;
    detailsForm: FormGroup;

    filePreview: string | null = null;
    fileType: 'image' | 'video' | null = null;
    selectedFile: File | null = null;
    isDragging = false;
    isSubmitting = false;

    userSubscription: Subscription | null = null;
    userId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private snackBar: SnackbarService,
        private authService: AuthService,
        private postService: PostService
    ) {
        this.uploadForm = this.fb.group({
            file: [null, Validators.required],
        });

        this.detailsForm = this.fb.group({
            caption: ['', [Validators.maxLength(2200)]],
            altText: [''],
        });
    }

    ngOnInit(): void {
        this.userSubscription = this.authService.user$.subscribe({
            next: (user) => {
                this.userId = user?._id as string;
            },
            error: (error) => {
                console.error('Error fetching user data:');
            },
        });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.handleFile(input.files[0]);
        }
    }

    handleFile(file: File): void {
        // Check if file is an image or video
        if (!file.type.match('image/*') && !file.type.match('video/*')) {
            this.snackBar.openSnackBar('Please select an image or video file', [
                'snackbar-error',
            ]);
            return;
        }

        this.selectedFile = file;
        this.fileType = file.type.startsWith('image/') ? 'image' : 'video';

        // Create a preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.filePreview = e.target.result;
            this.uploadForm.patchValue({ file: file });
        };
        reader.readAsDataURL(file);
    }

    removeFile(): void {
        this.filePreview = null;
        this.fileType = null;
        this.selectedFile = null;
        this.uploadForm.patchValue({ file: null });
    }

    onSubmit(): void {
        if (
            this.uploadForm.valid &&
            this.detailsForm.valid &&
            this.selectedFile
        ) {
            this.isSubmitting = true;

            // Combine form data
            const post: IBodyPost = {
                userId: this.userId as string,
                media: this.selectedFile,
                caption: this.detailsForm.get('caption')?.value,
                altText: this.detailsForm.get('altText')?.value,
            };

            this.postService.createPost(post).subscribe({
                next: (response) => {
                    this.isSubmitting = false;
                    console.log(response);
                    this.snackBar.openSnackBar('Your post has been shared!');
                },
                error: (error) => {
                    console.log(error);
                    this.isSubmitting = false;
                    this.snackBar.openSnackBar('Failed to share post', [
                        'snackbar-error',
                    ]);
                },
            });
        }
    }
}
