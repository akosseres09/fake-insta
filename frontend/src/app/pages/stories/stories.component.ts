import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryComponent } from './story/story.component';
import { MaterialModule } from '../../material.module';
import { StoryService } from '../../shared/story/story.service';

@Component({
    selector: 'app-stories',
    standalone: true,
    imports: [CommonModule, StoryComponent, MaterialModule],
    templateUrl: './stories.component.html',
    styleUrl: './stories.component.scss',
})
export class StoriesComponent {
    users = [
        {
            username: 'your_story',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        {
            username: 'janedoe',
            avatar: 'https://i.pravatar.cc/150?img=5',
        },
        {
            username: 'travel_guy',
            avatar: 'https://i.pravatar.cc/150?img=8',
        },
        {
            username: 'foodlover',
            avatar: 'https://i.pravatar.cc/150?img=10',
        },
        {
            username: 'photographer',
            avatar: 'https://i.pravatar.cc/150?img=11',
        },
        {
            username: 'fitness_coach',
            avatar: 'https://i.pravatar.cc/150?img=12',
        },
        {
            username: 'artist',
            avatar: 'https://i.pravatar.cc/150?img=13',
        },
        {
            username: 'musician',
            avatar: 'https://i.pravatar.cc/150?img=14',
        },
    ];

    constructor(public storyService: StoryService) {}

    move(event: MouseEvent, container: HTMLDivElement, arrowIcon: HTMLElement) {
        this.storyService.moveStorySlider(event, container, arrowIcon);
    }
}
