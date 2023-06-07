import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { bottom } from '@popperjs/core';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private _snackbar:MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this._snackbar.open(message, action, {
      duration: 2000,
      verticalPosition:bottom,
    });
  }
}
