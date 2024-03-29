import { GlobalConstants } from './../../../shared/global-constants';
import { CategoryService } from './../../../services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ProductService } from './../../../services/product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FileHandle } from 'src/app/shared/File';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction:any="Add";
  action:any="Add";
  responseMessage:any;
  categorys:any=[];
  fileName!:string;

  formErrors : { [char: string]: string } = {
    'name': '',
    'categoryId': '',
    'price': '',
    'description': '',
    'file': ''
  } as const;

  validationMessages : any = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'categoryId': {
      'required':      'categoryId is required.'
    },
    'price': {
      'required':      'price is required.',
      'min'     :      'price must be at least 0 DH.'
    },
    'description': {
      'required':      'description is required.',
      'minlength':     'Name must be at least 5 characters long.',
      'maxlength':     'Name cannot be more than 50 characters long.'
    },
    'file' :{
      'required':      'file is required.'
    }
  };

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private productService:ProductService,
  public dialogRef:MatDialogRef<ProductComponent>,
  private snackbar: SnackbarService,
  private categoryService:CategoryService,
  private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name:[null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      categoryId:[null, Validators.required],
      price:[null, Validators.required],
      description:[null, [Validators.minLength(5), Validators.maxLength(50)]],
      file:[this.fileName]
    })
    this.productForm.file = this.fileName;

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.productForm.patchValue(this.dialogData.data);
    }

    this.getCategorys();

    this.productForm.valueChanges
    .subscribe((data: any) => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now
  }



  onValueChanged(data?: any) {
    if (!this.productForm) { return; }
    const form = this.productForm;
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
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

  handelSubmit(){
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add(){
    console.log(this.fileName,"+++++++++++++")
    var formData = this.productForm.value;

    var data = {
      name:formData.name,
      categoryId:formData.categoryId,
      description:formData.description,
      price:formData.price,
      file:this.fileName
    }
    console.log(data);

    this.productService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response.message;
      this.snackbar.openSnackbar(this.responseMessage, "Success");
    }, (error:any)=>{
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

  edit(){
    var formData = this.productForm.value;

    console.log(this.fileName);
    console.log(this.dialogData.data.id," id");
    if (this.fileName === undefined) {
      console.log("do not update the file ");
      var data = {
        id:this.dialogData.data.id,
        name:formData.name,
        categoryId:formData.categoryId,
        description:formData.description,
        price:formData.price,

      }

      console.log(data);

      this.productService.update(data).subscribe((response:any)=>{
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = response.message;
        this.snackbar.openSnackbar(this.responseMessage, "Success");
      }, (error:any)=>{
        if(error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
      })
    } else {

      console.log(" update the file ");
      var dataa = {
      id:this.dialogData.data.id,
      name:formData.name,
      categoryId:formData.categoryId,
      description:formData.description,
      price:formData.price,
      file:this.fileName
    }

    console.log(dataa);

    this.productService.update(dataa).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.message;
      this.snackbar.openSnackbar(this.responseMessage, "Success");
    }, (error:any)=>{
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
    }
  }
  onFileSelected(event:any) {
    if (event.target.files) {
      const file = event.target.files[0];

      const fileHandle : FileHandle = {
        file: file,
        url:this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
      }
      console.log(fileHandle.file.name)
      this.fileName = fileHandle.file.name;
      this.productForm.file = fileHandle.file.name;
    }
  }

}
