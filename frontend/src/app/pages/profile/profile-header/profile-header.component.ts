import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../shared/model/User';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-profile-header',
    imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
    templateUrl: './profile-header.component.html',
    styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
    @Input() user: User | null = null;
    @Input() postsCount: number = 0;
}
