import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { RestService } from 'src/app/services/rest.service';
@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.css']
})
export class CommonHeaderComponent {
  activeMenu = "" as any;
  studioName = "" as any;
  name = "" as any;
  userType = "" as any;
  totalInventary = 0 as any;
  studioRole = '' as any;
  buysubscriptionList = [] as any;
  subscriptionlimit: number = 10;
  subscriptionoffset: number = 0;
  todatDate = new Date().toISOString().split('T')[0];
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private common: CommonService, private rest: RestService) {
    this.getUserDetails();
    this.activeMenu = this.router.url.split("/")[1];
  }
  ngOnInit() {
    this.userType = localStorage.getItem('slUserType');
    this.studioName = localStorage.getItem('studioName');
    this.name = localStorage.getItem('name');
    this.studioRole = localStorage.getItem('studioRole');
    this.getAllBuySubscriptionList();
  }


  getUserDetails() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getUserDetials(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response.length > 0) {
          localStorage.setItem('studioName', res.response[0].orgName);
          localStorage.setItem('name', res.response[0].name);
          this.totalInventary = res.response[0].totalInventary;
        }
      }
    });
  }
  goToProfile() {
    this.router.navigate(['user']);
  }
  goToInventory() {
    this.router.navigate(['inventory']);
  }
  goToEmployee() {
    this.router.navigate(['employee']);
  }
  goToBookkeeping() {
    this.router.navigate(['book-keeping']);
  }
  goTojobBookkeeping() {
    this.router.navigate(['job-book-keeping']);
  }
  goToQuote() {
    this.router.navigate(['quote']);
  }
  goToNetwork() {
    this.router.navigate(['network']);
  }
  // goToReports() {
  //   this.router.navigate(['reports']);
  // }
  goToPaymentDetails() {
    this.router.navigate(['payment-details']);
  }
  goToCalender() {
    this.router.navigate(['calender']);
  }
  // goToPublicCalender() {
  //   this.router.navigate(['public-calender']);
  // }

  goToBookingCalender() {
    this.router.navigate(['booking-calender']);
  }

  goToJob() {
    console.log('enter here')
    // if(this.buysubscriptionList.length == 0 || (this.buysubscriptionList[0].no_of_jobs - this.buysubscriptionList[0].completejob) == 0 || this.buysubscriptionList[0].end_date < this.todatDate) {
    //   this.common.showAlertMessage('Buy subscription to add jobs', this.common.succContent);
    //   this.router.navigate(['subscription']);
    //   return
    // }

    // this.router.navigate(['job']);

    if (this.totalInventary > 0) {
      this.router.navigate(['job']);
    } else {
      this.common.showAlertMessage("First add your inventary then add the job", this.common.errContent);
      return;
    }
  }

  getAllBuySubscriptionList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: this.userType,
      limit: this.subscriptionlimit,
      offset: this.subscriptionoffset
    };
    this.rest.getAllBuySubscriptionList(data).subscribe((res: any) => {
      if (res.success) {
        this.buysubscriptionList = res.response;
      }
    })
  }
}
