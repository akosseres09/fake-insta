import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../shared/model/Post';
import { PostService } from '../../shared/services/post/post.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-view-post',
    imports: [PostComponent, CommonModule, MatProgressSpinnerModule],
    templateUrl: './view-post.component.html',
    styleUrl: './view-post.component.scss',
})
export class ViewPostComponent implements OnInit, OnDestroy {
    id?: string;
    post?: Post;
    postSubscription?: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private postService: PostService,
        private snackbar: SnackbarService
    ) {}

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get('id') as string;
        console.log(this.id);

        this.postSubscription = this.postService
            .getPostById(this.id)
            .subscribe({
                next: (res) => {
                    if (!res.result) {
                        this.snackbar.openSnackBar('Post not found', [
                            'snackbar-error',
                        ]);
                        return;
                    }
                    this.post = res.result as Post;
                },
                error: (err) => {
                    console.error(err);
                    this.snackbar.openSnackBar('Error while fetching post', [
                        'snackbar-error',
                    ]);
                },
            });
    }

    ngOnDestroy(): void {
        this.postSubscription?.unsubscribe();
    }
}
