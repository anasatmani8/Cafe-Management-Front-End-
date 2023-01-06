import { GlobalConstants } from './../../../shared/global-constants';
import { SnackbarService } from './../../../services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from './../../../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any = FormGroup;
  responseMessage: any;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxSpinnerService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  validateSubmit() {
    if (
      this.changePasswordForm.controls['newPassword'].value !=
      this.changePasswordForm.controls['confirmPassword'].value
    ) {
      return true;
    } else {
      return false;
    }
  }

  handelChangePasswordSubmit(){
    this.ngxService.show();
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword : formData.oldPassword,
      newPassword : formData.newPassword,
      confirmPassword : formData.confirmPassword
    }
    this.userService.chnagePassword(data).subscribe((response:any)=>{
      this.ngxService.hide();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackbar(this.responseMessage,"Success");
    }, (error)=>{
      console.log(error);
      this.ngxService.hide();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;

      } else {
        this.responseMessage =  GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }
}
