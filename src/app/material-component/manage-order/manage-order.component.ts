import { GlobalConstants } from './../../shared/global-constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { BillService } from './../../services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CategoryService } from './../../services/category.service';
import { ProductService } from './../../services/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'total',
    'edit',
  ];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  total: number = 0;
  responseMessage: any;
  price: any;

  formErrors: { [char: string]: string } = {
    name: '',
    email: '',
    contactNumber: '',
    paymentMethod: '',
    category: '',
    product: '',
    price: '',
    quantity: '',
    total: '',
  } as const;

  validationMessages: any = {
    name: {
      required: 'Name is required.',
      minlength: 'Name must be at least 2 characters long.',
      maxlength: 'Name cannot be more than 25 characters long.',
    },
    category: {
      required: 'category is required.',
    },
    contactNumber: {
      required: 'Tel. number is required.',
      pattern: 'Tel. number must contain only numbers.',
    },
    email: {
      required: 'Email is required.',
      email: 'Email not in valid format.',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: SnackbarService,
    private billService: BillService,
    private ngxSpinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.ngxSpinner.show();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.nameRegex),
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      email: [
        null,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(GlobalConstants.emailRegex),
        ],
      ],
      contactNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.contactNumberRegex),
        ],
      ],
      paymentMethod: [null, [Validators.required]],
      category: [null, [Validators.required]],
      product: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
      quantity: [null],
    });
    this.manageOrderForm.valueChanges.subscribe((data: any) =>
      this.onValueChanged(data)
    );

    this.onValueChanged(); // (re)set validation messages now
  }
  onValueChanged(data?: any) {
    if (!this.manageOrderForm) {
      return;
    }
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

  getCategorys() {
    this.categoryService.getCategorys().subscribe(
      (response) => {
        this.ngxSpinner.hide();
        this.categorys = response;
      },
      (error: any) => {
        this.ngxSpinner.hide();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  getProductByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe(
      (response:any) => {
        this.products = response;
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue(0);
      },
      (error: any) => {
        this.ngxSpinner.hide();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  getProductDetails(value: any) {
    this.productService.getProductById(value.id).subscribe(
      (response: any) => {
        var product = this.manageOrderForm.controls['product'].value;
        this.price = product.price;
        this.manageOrderForm.controls['price'].setValue(this.price);
        this.manageOrderForm.controls['quantity'].setValue('1');
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
      },
      (error: any) => {
        this.ngxSpinner.hide();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    console.log(temp);
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['qantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['qantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    }
  }

  validateProductAdd() {
    if (
      this.manageOrderForm.controls['total'].value === 0 ||
      this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <= 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateSubmit() {
    if (
      this.total === 0 ||
      this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null ||
      !this.manageOrderForm.controls['contactNumber'].valid ||
      !this.manageOrderForm.controls['email'].valid
    ) {
      return true;
    } else {
    }
    return false;
  }

  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find(
      (e: { id: number }) => e.id == formData.product.id
    );
    if (productName === undefined) {
      this.total += formData.total;
      this.dataSource.push({
        id: formData.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });
      this.dataSource = [...this.dataSource];
      this.snackBar.openSnackbar(GlobalConstants.productAdded, 'Success');
    } else {
      this.snackBar.openSnackbar(
        GlobalConstants.productExistError,
        GlobalConstants.error
      );
    }
  }

  handelDeleteAction(value: any, element: any) {
    this.total -= element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction() {
    this.ngxSpinner.show();
    var formData = this.manageOrderForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      total: this.total,
      productDetails: JSON.stringify(this.dataSource),
    };
    this.billService.generateReport(data).subscribe(
      (response: any) => {
        this.downloadFile(response?.uuid);
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.total = 0;
      },
      (error: any) => {
        this.ngxSpinner.hide();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  downloadFile(fileName: any) {
    var data = {
      uuid: fileName,
    };
    this.billService.getPdf(data).subscribe(
      (response: any) => {
        saveAs(response, fileName + '.pdf');
        this.ngxSpinner.hide();
      },
      (error: any) => {
        this.ngxSpinner.hide();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
}
