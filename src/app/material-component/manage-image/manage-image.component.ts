import { ImageComponent } from './../dialog/image/image.component';
import { Router } from '@angular/router';
import { SnackbarService } from './../../services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from './../../services/product.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-manage-image',
  templateUrl: './manage-image.component.html',
  styleUrls: ['./manage-image.component.scss']
})
export class ManageImageComponent implements OnInit {



  constructor(private dialog:MatDialog,
    private productService:ProductService,
    private ngxService:NgxSpinnerService,
    private snackbar:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
  }

  handeAddActions(){
    const dialogConf = new MatDialogConfig();
    dialogConf.data = {
      action : 'Add'
    }
    dialogConf.width = "850px";
    const dialogRef = this.dialog.open(ImageComponent, dialogConf);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response)=>{

    })
  }

}
