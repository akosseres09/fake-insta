import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StoryService {
    constructor() {}

    currentStoryPosition: number = 0;
    scrollAmount: number = 120;

    moveStorySlider(
        event: MouseEvent,
        container: HTMLDivElement,
        arrowIcon: HTMLElement
    ) {
        const arrow: HTMLElement = event.target as HTMLElement;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (arrow.classList.contains('arrow-left')) {
            this.currentStoryPosition = Math.min(
                this.currentStoryPosition + this.scrollAmount,
                0
            );
        } else if (arrow.classList.contains('arrow-right')) {
            this.currentStoryPosition = Math.max(
                this.currentStoryPosition - this.scrollAmount,
                -maxScroll
            );
        }
        arrowIcon.style.display = 'block';
        if (
            container.clientWidth - this.currentStoryPosition ===
                container.scrollWidth ||
            this.currentStoryPosition === 0
        ) {
            arrow.parentElement!.style.display = 'none';
            arrowIcon.style.display = 'block';
        } else {
            arrow.parentElement!.style.display = 'block';
        }

        container.style.transform = `translateX(${this.currentStoryPosition}px)`;
    }
}
