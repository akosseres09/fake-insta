import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, MaterialModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
    @Output() logoutEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor(private authService: AuthService, private router: Router) {}

    logout(event: Event) {
        this.logoutEvent.emit();
    }
}
