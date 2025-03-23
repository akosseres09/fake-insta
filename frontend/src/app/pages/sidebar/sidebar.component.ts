import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { MatMenu } from '@angular/material/menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, MaterialModule, RouterModule, MatMenu],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {}
