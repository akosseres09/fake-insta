import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../shared/model/User';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, MaterialModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
    @Output() logoutEvent: EventEmitter<void> = new EventEmitter<void>();
    @Input() user: User | null = null;

    constructor(private authService: AuthService, private router: Router) {}

    logout(event: Event) {
        this.logoutEvent.emit();
    }
}
