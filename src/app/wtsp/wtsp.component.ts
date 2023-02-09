import { DOCUMENT } from '@angular/common';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-wtsp',
  templateUrl: './wtsp.component.html',
  styleUrls: ['./wtsp.component.scss']
})
export class WtspComponent implements OnInit {

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

    public dialogRef:MatDialogRef<WtspComponent>,
    private ngService:NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private snackBar:SnackbarService) { }

  ngOnInit(): void {
    this.ForgotPasswordForm = this.formBuilder.group({
      email:[null, [Validators.required]]

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

    this.document.location.href = 'https://web.whatsapp.com/send?phone=+212661973770&text='+data.email;
      this.dialogRef.close();

  }



}
