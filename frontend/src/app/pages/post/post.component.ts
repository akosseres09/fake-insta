import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    templateUrl: `./post.component.html`,
    styleUrl: './post.component.scss',
})
export class PostComponent {
    @Input() post: any = {
        username: '',
        userAvatar: '',
        location: '',
        imageUrl: '',
        likes: 0,
        caption: '',
        comments: [],
        time: '',
    };
}
