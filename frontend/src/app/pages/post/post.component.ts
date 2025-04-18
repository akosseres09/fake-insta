import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Post } from '../../shared/model/Post';
import { User } from '../../shared/model/User';
import { Data, LikeService } from '../../shared/services/like/like.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { UserService } from '../../shared/services/user/user.service';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    templateUrl: `./post.component.html`,
    styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
    @Input() post?: Post;
    currentUser?: User;
    user?: User;
    isLiked?: boolean;

    constructor(
        private likeService: LikeService,
        private userService: UserService,
        private snackbar: SnackbarService
    ) {}

    ngOnInit(): void {
        this.user = this.post?.userId as User;
        this.currentUser = this.userService.getCurrentUser();
        this.isLiked = this.post?.likes.includes(
            this.currentUser?._id as string
        );
    }

    likePost(action: 'like' | 'unlike') {
        const formData: Data = {
            userId: this.currentUser?._id as string,
            postId: this.post?._id as string,
            populate: 'userId',
            action: action,
        };

        this.likeService.likePost(formData).subscribe({
            next: (response) => {
                this.post = response.result as Post;
                this.snackbar.openSnackBar(
                    action === 'like' ? 'Post liked' : 'Post unliked',
                    ['snackbar-success']
                );
                this.isLiked = !this.isLiked;
            },
            error: (error) => {
                console.error(error);
                this.snackbar.openSnackBar(
                    'Error' + action === 'like'
                        ? 'liking'
                        : 'unliking' + 'post',
                    ['snackbar-error']
                );
            },
        });
    }
}
