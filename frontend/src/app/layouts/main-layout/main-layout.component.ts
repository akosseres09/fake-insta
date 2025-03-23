import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterNavComponent } from '../../pages/footer-nav/footer-nav.component';
import { SidebarComponent } from '../../pages/sidebar/sidebar.component';

@Component({
    selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterNavComponent,
        SidebarComponent,
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
    currentView = 'feed';
}
