import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {//https://web.whatsapp.com/send?phone=+212693202121&text=ggggg

  //<button type="button" (click)="goToUrl()">Click me!</button>

  /*import { DOCUMENT } from '@angular/common';
...
constructor(@Inject(DOCUMENT) private document: Document) { }

goToUrl(): void {
    this.document.location.href = 'https://stackoverflow.com';

    https://medium.com/nerd-for-tech/animate-fixed-sticky-header-on-scroll-in-angular-e2b68dc63791
    https://css-tricks.com/need-to-scroll-to-the-top-of-the-page/
}*/
//expansopn pannel

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
