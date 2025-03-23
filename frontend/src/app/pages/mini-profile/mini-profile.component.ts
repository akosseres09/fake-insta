import { Component } from '@angular/core';

@Component({
    selector: 'app-mini-profile',
    imports: [],
    templateUrl: './mini-profile.component.html',
    styleUrl: './mini-profile.component.scss',
})
export class MiniProfileComponent {
    user = {
        username: 'John Doe',
        name: 'your_username',
        avatar: 'https://i.pravatar.cc/150?img=1',
    };
}
