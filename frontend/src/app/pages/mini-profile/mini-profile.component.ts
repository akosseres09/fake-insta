import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/model/User';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user/user.service';

@Component({
    selector: 'app-mini-profile',
    imports: [CommonModule],
    templateUrl: './mini-profile.component.html',
    styleUrl: './mini-profile.component.scss',
})
export class MiniProfileComponent implements OnInit {
    user?: User;
    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.user = this.userService.getCurrentUser();
    }
}
