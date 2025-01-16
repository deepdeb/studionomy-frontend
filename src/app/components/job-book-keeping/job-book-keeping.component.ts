import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { RestService } from 'src/app/services/rest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-job-book-keeping',
  templateUrl: './job-book-keeping.component.html',
  styleUrls: ['./job-book-keeping.component.css']
})
export class JobBookKeepingComponent {
  todayDate = new Date().toISOString().split('T')[0];
  jb_id = 0;
  job_number = "";
  payment_criteria = "";
  index = "" as any;
  pageList = this.common.pageList;
  userType = "" as any;
  startDate = "";
  jb_description = [];
  endDate = this.todayDate;
  totalCount = 0;
  jobbookkeepingList: any = [];
  jobbookkeepingOffset = 0;
  jobbookkeepingLimit = 10;

  constructor(private rest: RestService, private common: CommonService, private router: Router, private location: Location, private activateRoute: ActivatedRoute) {
    this.userType = localStorage.getItem('slUserType');
  }

  ngOnInit() {
    this.getAllJobBookKeeping();
  }

  getAllJobBookKeeping() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      limit: this.jobbookkeepingLimit,
      offset: this.jobbookkeepingOffset,
      startDate: this.startDate,
      endDate: this.endDate,
      job_number: this.job_number,
      payment_criteria: this.payment_criteria
    };
    this.rest.getAllJobBookKeeping(data).subscribe((res: any) => {
      if (res.success) {
        this.jobbookkeepingList = [];
        this.jobbookkeepingList = res.response;
        this.totalCount = res.totalCount;
      }
    })
  }

  changePageLimit(event:any){
    this.jobbookkeepingLimit = Number(event.target.value)
    this.getAllJobBookKeeping();
  }

  clear() {
    this.startDate = "";
    this.endDate = this.todayDate;
    this.getAllJobBookKeeping();
  }
  
  search() {
    if (this.startDate == "" || this.startDate == null || this.startDate == undefined) {
      this.common.showAlertMessage("Please choose from date", this.common.errContent);
      return;
    }
    if (this.endDate == "" || this.endDate == null || this.endDate == undefined) {
      this.common.showAlertMessage("Please choose to date", this.common.errContent);
      return;
    }
    if (this.endDate < this.startDate) {
      this.common.showAlertMessage("Please choose valid date range", this.common.errContent);
      return;
    }
    this.getAllJobBookKeeping();
  }

  searchPayments() {
    this.getAllJobBookKeeping();
  }

  clearSearchPayments() {
    this.payment_criteria = ''
    this.getAllJobBookKeeping();
  }

  removeBookkeeping(jb_id: any, index: any) {
    this.jb_id = jb_id;
    this.index = index;
  }

  previous() {

  }

  next() {

  }
}
