import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  responseCode = '' as any;
  transactionId = '' as any;
  amount = '' as any; // Set this value according to your data
  responseData: any;
  subs_data: any;

  constructor(private route: ActivatedRoute, private router: Router, private rest: RestService, private common: CommonService) {}

  ngOnInit(): void {
    const data = localStorage.getItem('subsData');
    if(data) {
      this.subs_data = JSON.parse(data);
    }
    this.route.queryParams.subscribe(params => {
      this.responseData = params;
      this.amount = this.responseData.amount / 100;
      this.transactionId = this.responseData.transactionId;
      this.responseCode = this.responseData.responseCode;
    });
    this.buySubscription(this.subs_data, this.responseData)
}

buySubscription(subs_data: any, response: any) {
  const data = {
    no_of_jobs : subs_data.no_of_jobs,
    subs_for : subs_data.subs_for,
    subs_id : subs_data.subs_id,
    subs_type : subs_data.subs_type,
    final_amount: subs_data.final_amount,
    transaction_id: response.transactionId,
    response_code: response.responseCode,
    validity : subs_data.validity,
    userId : localStorage.getItem('slUserId'),
    userType : localStorage.getItem('slUserType')
  }
  this.rest.buySubscription(data).subscribe((res: any) => {
    if(res.success) {
      this.common.showAlertMessage('Subscription purchased successfully', this.common.succContent);
      localStorage.removeItem('subsData');
    }
  })
}

goToProfile() {
  this.router.navigate(['user'])
}

}