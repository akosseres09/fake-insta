import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { MaterialModule } from '../../material.module';
import { MiniProfileComponent } from '../mini-profile/mini-profile.component';
import { RouterModule } from '@angular/router';
import { PostService } from '../../shared/services/post/post.service';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/model/Post';

@Component({
    selector: 'app-feed',
    standalone: true,
    imports: [
        CommonModule,
        PostComponent,
        MaterialModule,
        MiniProfileComponent,
        RouterModule,
    ],
    templateUrl: './feed.component.html',
    styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit, OnDestroy {
    posts?: Array<Post>;
    postSub?: Subscription;
    constructor(private postService: PostService) {}

    ngOnInit(): void {
        this.postSub = this.postService.getPosts().subscribe({
            next: (data) => {
                this.posts = data.result as Array<Post>;
            },
            error: (error) => {
                console.error('Error fetching posts:', error);
            },
        });
    }

    ngOnDestroy(): void {
        this.postSub?.unsubscribe();
    }
}
