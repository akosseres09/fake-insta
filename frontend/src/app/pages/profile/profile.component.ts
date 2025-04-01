import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../shared/model/User';
import { Subscription } from 'rxjs';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileTabsComponent } from './profile-tabs/profile-tabs.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        ProfileHeaderComponent,
        ProfileTabsComponent,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
    user: User | null = null;
    userSub: Subscription | null = null;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.userSub = this.authService.user$.subscribe((user) => {
            console.log(user);

            this.user = user;
        });
    }

    userPosts = [
        {
            imageUrl:
                'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38',
            likes: 142,
            comments: 8,
        },
        {
            imageUrl:
                'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b',
            likes: 98,
            comments: 5,
        },
        {
            imageUrl:
                'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b',
            likes: 214,
            comments: 12,
        },
        {
            imageUrl:
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
            likes: 76,
            comments: 3,
        },
        {
            imageUrl:
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
            likes: 187,
            comments: 9,
        },
        {
            imageUrl:
                'https://images.unsplash.com/photo-1526512340740-9217d0159da9',
            likes: 124,
            comments: 6,
        },
        {
            imageUrl:
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
            likes: 231,
            comments: 15,
        },
        {
            imageUrl:
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
            likes: 156,
            comments: 7,
        },
        {
            imageUrl:
                'https://images.unsplash.com/photo-1519046904884-53103b34b206',
            likes: 192,
            comments: 11,
        },
    ];
}
