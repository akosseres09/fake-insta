import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-auth-layout',
    imports: [RouterOutlet, MaterialModule, RouterModule],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
