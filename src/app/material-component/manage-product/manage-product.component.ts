import { ConfirmationComponent } from './../dialog/confirmation/confirmation.component';
import { ProductComponent } from './../dialog/product/product.component';
import { GlobalConstants } from './../../shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  displayedColumns:string[] = ['image', 'name', 'categoryName', 'description', 'price', 'edit'];
  dataSource:any;
  responseMessage:any;

  constructor(private dialog:MatDialog,
    private productService:ProductService,
    private ngxService:NgxSpinnerService,
    private snackbar:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.show();
    this.tableData();
  }

  tableData(){
    this.productService.getProducts().subscribe((response:any)=>{
      this.ngxService.hide();
      console.log(response)
      this.dataSource = new MatTableDataSource(response);
    },(error)=>{
      this.ngxService.hide();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handeAddActions(){
    const dialogConf = new MatDialogConfig();
    dialogConf.data = {
      action : 'Add'
    }
    dialogConf.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConf);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response)=>{
      this.tableData();
    })
  }

  handelEditActions(values:any){
    const dialogConf = new MatDialogConfig();
    dialogConf.data = {
      action : 'Edit',
      data:values
    }
    dialogConf.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConf);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response)=>{
      this.tableData();
    })
  }

  handelDeleteActions(values:any){
    const dialogConfi = new MatDialogConfig();
    dialogConfi.data = {
      message:'delete '+values.name+' product'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfi);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.show();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id:any){
    console.log("1.1")
    this.productService.delete(id).subscribe((response:any)=>{
      console.log("delete 1");
      this.ngxService.hide();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbar.openSnackbar(this.responseMessage, "Success");
    },(error)=>{
      this.ngxService.hide();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }
  onChange(status:any, id:any){
    var data={
      status:status.toString(),
      id:id
    }
    console.log(data);
    this.productService.updateStatus(data).subscribe((response:any)=>{
      this.ngxService.hide();
      this.responseMessage = response?.message;
      this.snackbar.openSnackbar(this.responseMessage, "Success");
    },(error)=>{
      this.ngxService.hide();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

}
