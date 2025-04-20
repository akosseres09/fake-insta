import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { LikeWithUser } from '../../model/Like';
import { PostCommentWithUser } from '../../model/Comment';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-dialog',
    imports: [
        MatDialogModule,
        CommonModule,
        MatButtonModule,
        RouterModule,
        MatListModule,
    ],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string;
            comments?: Array<PostCommentWithUser>;
            likes?: Array<LikeWithUser>;
        },
        private router: Router,
        public dialogRef: MatDialogRef<DialogComponent>
    ) {}

    navigatePage(url: string) {
        this.dialogRef.close();
        this.router.navigateByUrl(url);
    }
}
