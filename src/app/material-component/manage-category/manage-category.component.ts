import { CategoryComponent } from './../dialog/category/category.component';
import { GlobalConstants } from './../../shared/global-constants';
import { SnackbarService } from './../../services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {


  displayedColumns= ['name', 'edit'];
  dataSource = new MatTableDataSource<Element>([]);
  responseMessage:any;
  constructor(private categoryService:CategoryService,
    private router:Router,
    private ngxSpinnerService:NgxSpinnerService,
    private snackbarService:SnackbarService,
    private dialog:MatDialog) { }

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.tableData();
  }

  tableData(){
    console.log('start getting categorys')
    this.categoryService.getCategorys().subscribe((response:any)=>{
      this.ngxSpinnerService.hide();
      this.dataSource = new MatTableDataSource(response);
      console.log(this.dataSource);
      console.log(response);

    },(error)=>{
      this.ngxSpinnerService.hide();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
    })

  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handeAddActions() {
    const dialogConf = new MatDialogConfig();
    dialogConf.data = {
      action : 'Add'
    }
    dialogConf.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConf);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
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
    const dialogRef = this.dialog.open(CategoryComponent, dialogConf);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe((response)=>{
      this.tableData();
    })

  }

}
