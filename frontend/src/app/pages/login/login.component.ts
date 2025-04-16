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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../shared/services/auth/auth.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { User } from '../../shared/model/User';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    loginForm: FormGroup;
    hidePassword = true;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private auth: AuthService,
        private snackBar: SnackbarService
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: [false],
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;

            const username = this.loginForm.get('username')?.value;
            const password = this.loginForm.get('password')?.value;

            this.auth.login(username, password).subscribe({
                next: (response) => {
                    const user: User = response.result as User;
                    localStorage.setItem('user', user._id as string);
                    this.isLoading = false;
                    this.auth.setUser(user);
                    this.router.navigateByUrl('/feed');
                },
                error: (error) => {
                    console.log(error);
                    this.snackBar.openSnackBar(error.error, ['snackbar-error']);
                    this.isLoading = false;
                },
            });
        }
    }
}
