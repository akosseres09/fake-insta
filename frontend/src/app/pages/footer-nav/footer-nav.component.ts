import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-footer-nav',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    templateUrl: './footer-nav.component.html',
    styleUrl: './footer-nav.component.scss',
})
export class FooterNavComponent {
    @Output() viewChange = new EventEmitter<string>();

    changeView(view: string) {
        this.viewChange.emit(view);
    }
}
