import { GlobalConstants } from './../shared/global-constants';
import { SnackbarService } from './../services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashbordService } from './../services/dashbord.service';
import { Component, AfterViewInit } from '@angular/core';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  responseMessage:any;
  data:any;
	ngAfterViewInit() { }

	constructor(private dashboardService: DashbordService,
    private ngxService:NgxSpinnerService,
    private snackbarService: SnackbarService) {
      this.ngxService.show();
      this.dashboardData();
	}

  dashboardData(){
    this.dashboardService.getDetails().subscribe((response:any)=>{
      this.ngxService.hide();
      this.data = response;
    }, (error:any)=>{
      this.ngxService.hide();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

}
