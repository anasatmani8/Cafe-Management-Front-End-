import { GlobalConstants } from './../shared/global-constants';
import { SnackbarService } from './../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from './../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  ForgotPasswordForm:any = FormGroup;
  responseMessage:any;

  formErrors : { [char: string]: string } = {
    'email': ''
  } as const;

  validationMessages : any = {
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    }
  };


  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngService:NgxSpinnerService,
    private snackBar:SnackbarService) { }

  ngOnInit(): void {
    this.ForgotPasswordForm = this.formBuilder.group({
      email:[null, [Validators.required, Validators.email, Validators.pattern(GlobalConstants.emailRegex)]]

    })
    this.ForgotPasswordForm.valueChanges
    .subscribe((data: any) => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now

  }
  onValueChanged(data?: any) {
    if (!this.ForgotPasswordForm) { return; }
    const form = this.ForgotPasswordForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)

        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  handelSubmit(){
    this.ngService.show();
    var formData = this.ForgotPasswordForm.value;
    var data = {
      email : formData.email
    }

    this.userService.forgotPassword(data).subscribe((response:any)=>{
      this.ngService.hide();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackBar.openSnackbar(this.responseMessage, "");

    },(error)=>{
      this.ngService.hide();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
      console.log(this.responseMessage, GlobalConstants.error);
    }
    )
  }



}
