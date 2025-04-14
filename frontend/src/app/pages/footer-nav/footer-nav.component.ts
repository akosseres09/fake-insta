import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { User } from '../../shared/model/User';

@Component({
    selector: 'app-footer-nav',
    standalone: true,
    imports: [CommonModule, MaterialModule, RouterModule],
    templateUrl: './footer-nav.component.html',
    styleUrl: './footer-nav.component.scss',
})
export class FooterNavComponent {
    @Input() user: User | null = null;
    @Output() viewChange = new EventEmitter<string>();
    @Output() logoutEvent: EventEmitter<void> = new EventEmitter<void>();

    changeView(view: string) {
        this.viewChange.emit(view);
    }

    logout(event: Event) {
        this.logoutEvent.emit();
    }
}
