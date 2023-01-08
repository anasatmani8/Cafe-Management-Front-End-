import { filter } from 'rxjs/operators';
import { GlobalConstants } from './../../shared/global-constants';
import { SnackbarService } from './../../services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handeAddActions() {}

  handelEditActions(value:any){}

}
