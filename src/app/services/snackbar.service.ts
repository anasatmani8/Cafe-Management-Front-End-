import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar:MatSnackBar) { }

  openSnackbar(message:string, action:string){
    if (action === 'error') {
      console.log("error","/", message);
      this.snackbar.open(message,'',{
        horizontalPosition:'center',
        verticalPosition:'top',
        duration:4000,
        panelClass: ['error']
      });
    } else {
      this.snackbar.open(message,'',{
        horizontalPosition:'center',
        verticalPosition:'top',
        duration:4000,
        panelClass:['green-snackbar']
      })
    }

  }
}
