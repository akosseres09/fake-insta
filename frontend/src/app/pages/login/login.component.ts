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
        private auth: AuthService
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
                next: (id) => {
                    localStorage.setItem('user', id as string);
                    this.isLoading = false;
                    this.router.navigateByUrl('/feed');
                },
                error: (error) => {
                    console.log(error);
                    this.isLoading = false;
                },
            });
        }
    }
}
