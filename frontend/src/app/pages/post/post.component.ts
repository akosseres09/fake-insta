import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Post } from '../../shared/model/Post';
import { User } from '../../shared/model/User';
import { Like, LikeWithUser } from '../../shared/model/Like';
import { PostComment, PostCommentWithUser } from '../../shared/model/Comment';
import { Data, LikeService } from '../../shared/services/like/like.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { UserService } from '../../shared/services/user/user.service';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommentService } from '../../shared/services/comment/comment.service';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
    ],
    templateUrl: `./post.component.html`,
    styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit, OnDestroy {
    @Input() post?: Post;
    commentForm: FormGroup;
    currentUser?: User;
    user?: User;
    comments?: Array<PostCommentWithUser>;
    likes?: Array<Like>;
    isLiked?: boolean;
    commentSubscription?: Subscription;
    likeSubscription?: Subscription;

    constructor(
        private likeService: LikeService,
        private userService: UserService,
        private commentService: CommentService,
        private snackbar: SnackbarService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog
    ) {
        this.commentForm = this.formBuilder.group({
            comment: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.user = this.post?.userId as User;
        this.currentUser = this.userService.getCurrentUser();
        this.isLiked = this.post?.likes.includes(
            this.currentUser?._id as string
        );
    }

    ngOnDestroy(): void {
        this.commentSubscription?.unsubscribe();
        this.likeSubscription?.unsubscribe();
    }

    addComment() {
        if (this.commentForm?.invalid) {
            return;
        }

        const data = {
            userId: this.currentUser?._id as string,
            postId: this.post?._id as string,
            text: this.commentForm?.value.comment,
        };

        this.commentService.createComment(data).subscribe({
            next: (response) => {
                this.snackbar.openSnackBar('Comment added', [
                    'snackbar-success',
                ]);
                console.log(response);
                this.commentForm.reset();
            },
            error: (error) => {
                console.error(error);
                this.snackbar.openSnackBar('Error adding comment', [
                    'snackbar-error',
                ]);
            },
        });
    }

    getComments() {
        this.commentSubscription = this.commentService
            .getCommentsToPost(this.post?._id as string)
            .subscribe({
                next: (response) => {
                    this.comments =
                        response.result as Array<PostCommentWithUser>;

                    this.openListDialog('Comments', this.comments);
                },
                error: (error) => {
                    console.error(error);
                    this.snackbar.openSnackBar('Error fetching comments', [
                        'snackbar-error',
                    ]);
                },
            });
    }

    getLikes() {}

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

    openListDialog(
        title: string,
        comments: Array<PostCommentWithUser> = [],
        likes: Array<LikeWithUser> = []
    ): void {
        this.dialog.open(DialogComponent, {
            data: {
                title,
                comments,
                likes,
            },
            width: '400px',
        });
    }
}
