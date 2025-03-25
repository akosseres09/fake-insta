import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private snackBar: MatSnackBar) {}

    openSnackBar(message: string, panel: Array<string> = []) {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: panel,
        });
    }
}
