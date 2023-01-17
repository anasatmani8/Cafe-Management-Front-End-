import { saveAs } from 'file-saver';
import { ConfirmationComponent } from './../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from './../dialog/view-bill-products/view-bill-products.component';
import { GlobalConstants } from './../../shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from './../../services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BillService } from './../../services/bill.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'contactNumber',
    'paymentMethod',
    'total',
    'view',
  ];
  dataSource:any;
  responseMessage:any;

  constructor(private billService:BillService,
    private dialog:MatDialog,
    private ngxSpinnerService: NgxSpinnerService,
    private snackBar:SnackbarService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.tableData();
  }

  tableData(){
    this.billService.getBills().subscribe((response:any)=>{
      this.ngxSpinnerService.hide();
      this.dataSource = new MatTableDataSource(response);
    },
      (error: any) => {
        this.ngxSpinnerService.hide();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handelViewAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data:values
    };
    dialogConfig.width = "100p%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
  }

  downloadReportAction(dataa:any){
    this.ngxSpinnerService.show();
    var data  = {
      uuid: dataa.name,
      name: dataa.name,
      email: dataa.email,
      contactNumber: dataa.contactNumber,
      paymentMethod: dataa.paymentMethod,
      total: dataa.total,
      productDetail: dataa.productDetail ,
    }
    this.billService.getPdf(dataa).subscribe((response:any)=>{
      saveAs(response, dataa.uuid+'.pdf');
      this.ngxSpinnerService.hide();
    })
  }

  handelDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message : 'delete '+values.name+' bill'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxSpinnerService.show();
      this.deleteProduct(values.id);
      console.log(values.id,"1");
      dialogRef.close();
    })
  }

  deleteProduct(id:any){
    console.log(id);
    this.billService.delete(id).subscribe((response:any)=>{
      this.ngxSpinnerService.show();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackBar.openSnackbar(this.responseMessage,"Success");
    },(error)=>{
      this.ngxSpinnerService.hide();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })

  }


}
