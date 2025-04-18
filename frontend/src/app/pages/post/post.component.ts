import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Post } from '../../shared/model/Post';
import { User } from '../../shared/model/User';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    templateUrl: `./post.component.html`,
    styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
    @Input() post?: Post;
    user?: User;

    ngOnInit(): void {
        this.user = this.post?.userId as User;
    }

    likePost() {}
}
