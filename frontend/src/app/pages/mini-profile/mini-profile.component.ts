import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../shared/model/User';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mini-profile',
    imports: [CommonModule],
    templateUrl: './mini-profile.component.html',
    styleUrl: './mini-profile.component.scss',
})
export class MiniProfileComponent implements OnInit {
    user?: User;
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.user = this.authService.getCurrentUser();
    }
}
