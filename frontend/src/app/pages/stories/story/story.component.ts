import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';

@Component({
    selector: 'app-story',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    templateUrl: './story.component.html',
    styleUrl: './story.component.scss',
})
export class StoryComponent {
    @Input() user: any = {
        username: '',
        avatar: '',
    };
}
