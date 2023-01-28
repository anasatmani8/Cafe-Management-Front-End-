import { DomSanitizer } from '@angular/platform-browser';
import { GlobalConstants } from './../../../shared/global-constants';
import { CategoryService } from './../../../services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { FileHandle } from 'src/app/shared/File';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any;
  fileName!:string;

  formErrors : { [char: string]: string } = {
    'name': '',
    'file': ''
  } as const;

  validationMessages : any = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'file' :{
      'required':      'file is required.'
    }
  };



  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private categoryService:CategoryService,
  public dialogRef:MatDialogRef<CategoryComponent>,
  private snackbar: SnackbarService,
  private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name:[null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
      ,file:[this.fileName]
    });

    this.categoryForm.file = this.fileName;
    console.log(this.dialogData);
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data);
    }

    this.categoryForm.valueChanges
    .subscribe((data: any) => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.categoryForm) { return; }
    const form = this.categoryForm;
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
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add(){
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name
    }

    this.categoryService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackbar.openSnackbar(this.responseMessage, "Success");
    }, (error)=>{
      this.dialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

  edit(){
    var formData = this.categoryForm.value;

    if (this.fileName === undefined) {

    console.log("do not update the file ");
    var data = {
      id  : this.dialogData.data.id,
      name: formData.name
    }
    console.log(data.id, " id");

    this.categoryService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = response.message;
      this.snackbar.openSnackbar(this.responseMessage, "Success");
    }, (error)=>{
      this.dialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }else {

    console.log(" update the file ");
    var dataa = {
      id  : this.dialogData.data.id,
      name: formData.name,
      file:this.fileName
    }
    console.log(dataa.id, " id");
    console.log(this.fileName, " file");

    this.categoryService.update(dataa).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = response.message;
      this.snackbar.openSnackbar(this.responseMessage, "Success");
    }, (error)=>{
      this.dialogRef.close();
      if (error.error?.message) {
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
      this.categoryForm.file = fileHandle.file.name;
    }
  }

}
