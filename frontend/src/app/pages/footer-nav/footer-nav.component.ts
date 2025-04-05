import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer-nav',
    standalone: true,
    imports: [CommonModule, MaterialModule, RouterModule],
    templateUrl: './footer-nav.component.html',
    styleUrl: './footer-nav.component.scss',
})
export class FooterNavComponent {
    @Output() viewChange = new EventEmitter<string>();
    @Output() logoutEvent: EventEmitter<void> = new EventEmitter<void>();

    changeView(view: string) {
        this.viewChange.emit(view);
    }

    logout(event: Event) {
        this.logoutEvent.emit();
    }
}
