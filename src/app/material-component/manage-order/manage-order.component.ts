import { GlobalConstants } from './../../shared/global-constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { BillService } from './../../services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CategoryService } from './../../services/category.service';
import { ProductService } from './../../services/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns:string[]= ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource:any=[];
  manageOrderForm:any=FormGroup;
  categorys:any=[];
  products:any=[];
  total:number=0;
  responseMessage:any;
  price:any;

  formErrors : { [char: string]: string } = {
    'name': '',
    'email':'',
    'contactNumber':'',
    'paymentMethod':'',
    'category': '',
    'product': '',
    'price': '',
    'quantity': '',
    'total': ''
  } as const;

  validationMessages : any = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'category': {
      'required':      'category is required.'
    },
    'contactNumber': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    }
  };


  constructor(private formBuilder:FormBuilder,
    private productService:ProductService,
    private categoryService:CategoryService,
    private snackBar:SnackbarService,
    private billService:BillService,
    private ngxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.ngxSpinner.show();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name:[null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex), Validators.minLength(2), Validators.maxLength(25)]],
      email:[null, [Validators.required, Validators.email, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod:[null, [Validators.required ]],
      category:[null, [Validators.required ]],
      product:[null, [Validators.required ]],
      price:[null, [Validators.required ]],
      total:[0, [Validators.required ]],
      quantity:[0, [Validators.required ]],
    })
    this.manageOrderForm.valueChanges
    .subscribe((data: any) => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now

  }
  onValueChanged(data?: any) {
    if (!this.manageOrderForm) { return; }
    const form = this.manageOrderForm;
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

  getCategorys(){
    this.categoryService.getCategorys().subscribe((response)=>{
      this.categorys = response;
    }, (error:any)=>{
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

}
