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

    getThumbnail(videoUrl: string): string {
        // Check if it's a Cloudinary video URL
        if (!videoUrl.includes('/video/upload/')) {
            return videoUrl;
        }

        // Inject the Cloudinary transformation options
        const transformedUrl = videoUrl.replace(
            '/video/upload/',
            '/video/upload/so_1,c_fill,w_300,h_300/' //so=1  start offset at 1 seconds
        );

        // Replace file extension with .jpg
        const lastDotIndex = transformedUrl.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            return transformedUrl.substring(0, lastDotIndex) + '.jpg';
        }

        return transformedUrl + '.jpg';
    }
}
