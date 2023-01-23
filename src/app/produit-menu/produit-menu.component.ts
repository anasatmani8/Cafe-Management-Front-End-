import { ProductService } from './../services/product.service';

import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { expand, flyInOut, visibility } from '../animations/animation';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup,FormControl, Validators, FormBuilder }  from '@angular/forms';
import { Comment } from '../shared/Comment';

@Component({
  selector: 'app-produit-menu',
  templateUrl: './produit-menu.component.html',
  styleUrls: ['./produit-menu.component.scss'],
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})

export class ProduitMenuComponent implements OnInit {

  ctrl = new FormControl(null, Validators.required);


	toggle() {
		if (this.ctrl.disabled) {
			this.ctrl.enable() ;
		} else {
			this.ctrl.disable();
		}
	}


  @ViewChild('fform')
  feedbackFormDirective!: { resetForm: () => void; };

  feedbackForm!: FormGroup ;
  feedback!: Comment;
  public id!: any;

  formErrors : { [char: string]: string } = {
    'author': '',
    'comment': '',
  } as const;



  validationMessages : any = {
    'author': {
      'required':      ' Name is required.',
      'minlength':     ' Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 4 characters long.',
      'maxlength':     'Comment cannot be more than 25 characters long.'
    }
  };

  constructor(private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private productService:ProductService) {
      this.createForm();
     }

  ngOnInit(): void {
    //this.productService.getProductByCategory()
    this.id = this.route.snapshot.paramMap.get('id');


  }

  createForm() {
    this.feedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)] ],
      rating: ['', [Validators.required]]
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now


}

onValueChanged(data?: any) {
  if (!this.feedbackForm) { return; }
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

}
