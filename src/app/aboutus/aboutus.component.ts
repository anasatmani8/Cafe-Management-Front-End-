import { LoginComponent } from './../login/login.component';
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { SignupComponent } from './../signup/signup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { expand } from '../animations/animation';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
  animations: [ expand()]
})

export class AboutusComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  handelSignupAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(SignupComponent, dialogConfig);
  }

  handelForgotPasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

  handelLoginAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(LoginComponent, dialogConfig);
  }

}
