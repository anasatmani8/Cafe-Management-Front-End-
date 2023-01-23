import { UserService } from './../services/user.service';
import { LoginComponent } from './../login/login.component';
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { SignupComponent } from './../signup/signup.component';
import { environment } from 'src/environments/environment';

import { GlobalConstants } from './../shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CategoryService } from './../services/category.service';
import { Component, OnInit } from '@angular/core';
import {  flyInOut, expand } from '../animations/animation';
import { Category } from '../shared/category';

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class CategoryMenuComponent implements OnInit {

  dataSource! :Category[];
  responseMessage:any;
  baseURL = environment.apiUrl;
  constructor(private categoryService:CategoryService,
    private router:Router,
    private ngxSpinnerService:NgxSpinnerService,
    private snackbarService:SnackbarService,
    private dialog:MatDialog,
    private userService:UserService
    ) { }


    ngOnInit(): void {

        this.ngxSpinnerService.show();
        this.tableData();
      }


      tableData(){
        console.log('start getting categorys')
        this.categoryService.getCategorys().subscribe((response:any)=>{
          this.ngxSpinnerService.hide();
          this.dataSource = response;
          console.log(this.dataSource);
          console.log(response);

        },(error)=>{
          this.ngxSpinnerService.hide();
          if (error.error?.message) {
            this.responseMessage = error.error?.message;
          }
          else {
            this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
        })
      }

      categoryMenu(){
        this.router.navigate(['/cafe/category']);
      }

      handelSignupAction(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "550px";
        this.dialog.open(SignupComponent, dialogConfig);
      }

      handelForgotPasswordAction(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "550px";
        this.dialog.open(ForgotPasswordComponent, dialogConfig);
      }

      handelLoginAction(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "550px";
        this.dialog.open(LoginComponent, dialogConfig);
      }

    }

