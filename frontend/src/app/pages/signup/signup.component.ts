import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../shared/services/auth/auth.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
})
export class SignupComponent {
    signupForm: FormGroup;
    hidePassword = true;
    hidePasswordConfirm = true;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private snackBar: SnackbarService
    ) {
        this.signupForm = this.fb.group(
            {
                email: ['', [Validators.required, Validators.email]],
                name: this.fb.group({
                    first: [''],
                    last: [''],
                }),
                username: ['', Validators.required],
                password: ['', [Validators.required, Validators.minLength(6)]],
                passwordConfirm: [
                    '',
                    [Validators.required, Validators.minLength(6)],
                ],
            },
            {
                validators: this.passwordMatchValidator(
                    'password',
                    'passwordConfirm'
                ),
            }
        );
    }

    passwordMatchValidator(controlName: string, mactchingControlName: string) {
        return (FormGroup: FormGroup) => {
            const control = FormGroup.controls[controlName];
            const matchingControl = FormGroup.controls[mactchingControlName];

            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
                control.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
                control.setErrors(null);
            }
        };
    }

    onSubmit() {
        if (this.signupForm.valid) {
            this.isLoading = true;

            this.authService.register(this.signupForm.value).subscribe({
                next: (data) => {
                    this.isLoading = false;
                    this.snackBar.openSnackBar('Account created successfully');
                },
                error: (error) => {
                    console.log(error);
                    this.isLoading = false;
                    this.snackBar.openSnackBar('Error creating account', [
                        'Error',
                    ]);
                },
            });
        }
    }
}
