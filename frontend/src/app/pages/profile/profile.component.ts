import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../shared/model/User';
import { Subscription } from 'rxjs';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileTabsComponent } from './profile-tabs/profile-tabs.component';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../shared/model/Post';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ProfileHeaderComponent, ProfileTabsComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
    user: User | null = null;
    posts: Array<Post> | null = null;
    postsCount: number = 0;
    userSub: Subscription | null = null;
    ownProfile: boolean = true;
    isLoading: boolean = true;

    constructor(
        private authService: AuthService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const userId = this.activatedRoute.snapshot.paramMap.get('id');
        this.userSub = this.authService
            .getUserProfile(userId as string)
            .subscribe({
                next: (data) => {
                    this.user = data.result.user as User;
                    this.posts = data.result.posts as Array<Post>;
                    this.postsCount = this.posts.length;
                },
                error: (err) => {
                    console.error(err);
                },
            });
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
    }
}
