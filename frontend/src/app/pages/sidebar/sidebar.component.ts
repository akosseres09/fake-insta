import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, MaterialModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnDestroy {
    logoutSubscription: Subscription | null = null;

    constructor(private authService: AuthService, private router: Router) {}

    logout(event: Event): void {
        this.logoutSubscription = this.authService.logout().subscribe({
            next: (response) => {
                localStorage.removeItem('user');
                this.router.navigateByUrl('/auth/login');
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    ngOnDestroy(): void {
        this.logoutSubscription?.unsubscribe();
    }
}
