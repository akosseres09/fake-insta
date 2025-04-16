import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth/auth.service';
import { User } from '../../shared/model/User';
import { Subscription } from 'rxjs';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileTabsComponent } from './profile-tabs/profile-tabs.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../shared/model/Post';
import { UserService } from '../../shared/services/user/user.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ProfileHeaderComponent, ProfileTabsComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
    queriedUser?: User; //queried user via query param
    currentUser?: User; //logged in user
    posts: Array<Post> | null = null;
    postsCount: number = 0;
    userSub: Subscription | null = null;
    ownProfile: boolean = true;
    isLoading: boolean = true;

    constructor(
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const userId = this.activatedRoute.snapshot.paramMap.get('id');
        this.userSub = this.userService
            .getUserProfile(userId as string)
            .subscribe({
                next: (data) => {
                    this.queriedUser = data.result.user as User;
                    this.posts = data.result.posts as Array<Post>;
                    this.postsCount = this.posts.length;
                },
                error: (err) => {
                    console.error(err);
                    this.router.navigateByUrl('/feed');
                },
            });

        this.currentUser = this.userService.getCurrentUser();
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
    }

    isSameUser(): boolean {
        if (this.currentUser && this.queriedUser) {
            return this.currentUser._id === this.queriedUser._id;
        }
        return false;
    }
}
