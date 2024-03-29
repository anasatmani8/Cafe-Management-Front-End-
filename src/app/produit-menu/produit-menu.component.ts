import { LoginComponent } from './../login/login.component';
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { SignupComponent } from './../signup/signup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GlobalConstants } from './../shared/global-constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from './../services/product.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { expand, flyInOut, visibility } from '../animations/animation';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Comment } from '../shared/Comment';
import { Product } from '../shared/product';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-produit-menu',
  templateUrl: './produit-menu.component.html',
  styleUrls: ['./produit-menu.component.scss'],
  animations: [visibility(), flyInOut(), expand()],
})
export class ProduitMenuComponent implements OnInit {
  ctrl = new FormControl(null, Validators.required);

  toggle() {
    if (this.ctrl.disabled) {
      this.ctrl.enable();
    } else {
      this.ctrl.disable();
    }
  }

  @ViewChild('fform')
  feedbackFormDirective!: { resetForm: () => void };

  feedbackForm!: FormGroup;
  feedback!: Comment;
  dishIds!: string[];
  id!: string;
  product!: Product[];
  productCopy!: Product;
  prev!: string;
  next!: string;
  responseMessage: any;
  visibility = 'shown';

  formErrors: { [char: string]: string } = {
    author: '',
    comment: '',
  } as const;

  validationMessages: any = {
    author: {
      required: ' Name is required.',
      minlength: ' Name must be at least 2 characters long.',
      maxlength: 'Name cannot be more than 25 characters long.',
    },
    comment: {
      required: 'Comment is required.',
      minlength: 'Comment must be at least 4 characters long.',
      maxlength: 'Comment cannot be more than 25 characters long.',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private ngxSpinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    // to show the list of product of every category selected with the two best comment
    // and a form to add a new comment
    // to add image : https://www.youtube.com/watch?v=oTJ89wcz5Ec
    this.ngxSpinnerService.show();
    this.id = this.route?.snapshot?.paramMap?.get('id')!;
    console.log(+this.id);

    this.productService.getProductByCategory(+this.id).subscribe(
        (response: any) => {
          this.ngxSpinnerService.hide();
          this.product = response;
          console.log(this.product);
        },
        (error) => {
          this.ngxSpinnerService.hide();
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


  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(25),
        ],
      ],
      rating: ['', [Validators.required]],
    });
    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
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

  categoryMenu() {
    this.router.navigate(['/cafe/category']);
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
