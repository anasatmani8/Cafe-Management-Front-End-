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
  newPassword = true;
  confirmPassword = true;
  oldPassword = true;
  changePasswordForm:any = FormGroup;
  responseMessage: any;

  formErrors : { [char: string]: string } = {
    'newPassword': '',
    'confirmPassword': '',
    'oldPassword': ''
  } as const;

  validationMessages : any = {
    'newPassword': {
      'required':      'Password is required',
      'minlength':     'Password must be at least 2 charachters long',
      'maxlength':     'Password cannot be more than 100 charachters long'
    },
    'confirmPassword': {
      'required':      'Password is required',
      'minlength':     'Password must be at least 2 charachters long',
      'maxlength':     'Password cannot be more than 100 charachters long'
    },
    'oldPassword': {
      'required':      'Password is required',
      'minlength':     'Password must be at least 2 charachters long',
      'maxlength':     'Password cannot be more than 100 charachters long'
    }
  };
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxSpinnerService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      newPassword: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });
    this.changePasswordForm.valueChanges
    .subscribe((data: any) => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.changePasswordForm) { return; }
    const form = this.changePasswordForm;
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

  handelChangePasswordSubmit() {
    this.ngxService.show();
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };
    this.userService.chnagePassword(data).subscribe(
      (response: any) => {
        this.ngxService.hide();
        this.responseMessage = response?.message;
        this.dialogRef.close();
        this.snackbarService.openSnackbar(this.responseMessage, 'Success');
      },
      (error) => {
        console.log(error);
        this.ngxService.hide();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }
}
