import { ProductService } from './../../../services/product.service';
import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  onAddProduct = new EventEmitter();
  imgUrl:any;
  userfile:any;
  message!:string;
  public imagePath: any;

  imageForm:any = FormGroup;

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
  constructor( private productService:ProductService) { }



  ngOnInit(): void {
    this.imageForm = this.imageForm.group({
      name:[null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      file:[null]
    });


    this.imageForm.valueChanges
    .subscribe((data: any) => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now
  }
  onSubmit(){
    this.addData();

  }

  onSelectFile(event:any){
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      this.userfile =file;

      var mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only message are supported.";
        return;
      }
      var reader = new FileReader();
      this.imagePath = file;
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgUrl = reader.result;
      }

    }

  }



  onValueChanged(data?: any) {
    if (!this.imageForm) { return; }
    const form = this.imageForm;
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


  addData(){
    const formData = this.imageForm.value
    const name = this.imageForm.name;
    formData.append("name",JSON.stringify(name));
    formData.append("file",this.userfile);
    this.productService.addImage(formData).subscribe(data =>{
      console.log("ok")
    })
  }

}
