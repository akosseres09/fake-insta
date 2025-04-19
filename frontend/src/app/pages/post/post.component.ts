import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Post, PostWithComments } from '../../shared/model/Post';
import { User } from '../../shared/model/User';
import { Like } from '../../shared/model/Like';
import { Data, LikeService } from '../../shared/services/like/like.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { UserService } from '../../shared/services/user/user.service';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Comment } from '../../shared/model/Comment';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [CommonModule, MaterialModule, ReactiveFormsModule],
    templateUrl: `./post.component.html`,
    styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
    @Input() post?: PostWithComments;
    commentForm?: FormGroup;
    currentUser?: User;
    user?: User;
    comments?: Array<Comment>;
    likes?: Array<Like>;
    isLiked?: boolean;

    constructor(
        private likeService: LikeService,
        private userService: UserService,
        private snackbar: SnackbarService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.user = this.post?.userId as User;
        this.currentUser = this.userService.getCurrentUser();
        this.isLiked = this.post?.likes.includes(
            this.currentUser?._id as string
        );
        this.comments = this.post?.comments as Array<Comment>;

        this.commentForm = this.formBuilder.group({
            comment: ['', [Validators.required]],
        });
    }

    addComment() {
        if (this.commentForm?.invalid) {
            return;
        }
        this.commentForm?.get('comment')?.reset('');
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
                this.post = response.result as PostWithComments;
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
