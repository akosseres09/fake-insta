import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { Post } from '../../../shared/model/Post';

@Component({
    selector: 'app-profile-tabs',
    imports: [MatIconModule, MatTabsModule, MatRippleModule, CommonModule],
    templateUrl: './profile-tabs.component.html',
    styleUrl: './profile-tabs.component.scss',
})
export class ProfileTabsComponent {
    @Input() userPosts: Array<Post> | null = null;
}
