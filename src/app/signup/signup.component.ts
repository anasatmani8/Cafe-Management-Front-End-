import { GlobalConstants } from './../shared/global-constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackbarService } from './../services/snackbar.service';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  password = true;
  confirmPassword = true;
  signupForm:any = FormGroup;
  responseMessage: any;

  formErrors : { [char: string]: string } = {
    'name': '',
    'contactNumber': '',
    'email': '',
    'password': ''
  } as const;

  validationMessages : any = {
      'name': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },

    'contactNumber': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
    'password': {
      'required':      'Password is required',
      'minlength':     'Password must be at least 5 charachters long',
      'maxlength':     'Password cannot be more than 100 charachters long'
    }
  };
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngService:NgxSpinnerService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name:[null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex), Validators.minLength(2), Validators.maxLength(25)]],
      email:[null, [Validators.required, Validators.email, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:[null, [Validators.required]],
      confirmPassword:[null, [Validators.required]],
    })
    this.signupForm.valueChanges
    .subscribe((data: any) => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now

  }
  onValueChanged(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;
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

  validateSubmit(){
    if (this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value) {
      return true;
    }
    else {
      return false;
    }
  }

  handelSubmit(){
    this.ngService.show();
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }

    this.userService.signup(data).subscribe((response:any)=>{
      this.ngService.hide();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackBarService.openSnackbar(this.responseMessage, "");

    },(error)=>{
      this.ngService.hide();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackbar(this.responseMessage, GlobalConstants.error);

      console.log(this.responseMessage, GlobalConstants.error);
    })
  }

}
