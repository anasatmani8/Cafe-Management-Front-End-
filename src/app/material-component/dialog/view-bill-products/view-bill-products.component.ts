import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss']
})
export class ViewBillProductsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total'];
  dataSource:any;
  Data:any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialog:any,
  public dialogRef:MatDialogRef<ViewBillProductsComponent>) { }

  ngOnInit() {
    console.log(this.dialog, " ///")
    this.Data = this.dialog.data;
    this.dataSource = JSON.parse(this.dialog.data.productDetail);

  }
}
