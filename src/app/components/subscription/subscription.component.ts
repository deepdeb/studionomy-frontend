import { Component } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {
  subscriptionType = "" as any;
  subscriptionList: any = [];
  topupsubscriptionList: any = [];
  subscriptionSubject: any;
  studioName = '' as any;
  mobile = '' as any;
  email = '' as any;
  userId = localStorage.getItem('slUserId');
  userType = localStorage.getItem('slUserType');
  buysubscriptionList: any;
  buy_subs_id: any;
  jobs_remain: any;
  subscription_end_date: any;
  isUserLoggedin : any;
  main_jobs_remaining: any;
  constructor(private common: CommonService, private rest: RestService, private router: Router) { }

  ngOnInit() {
    this.subscriptionSubject = this.common.subscriptionSubject.subscribe((res: any) => {
      if (res) {
        var subsTab: any = document.querySelector('.nav-link.active');
        var studioTab: any = document.getElementById("nav-home-tab");
        var eqipmentTab: any = document.getElementById("nav-contact-tab");
        setTimeout(() => {
          if (res == 0) {
            subsTab.classList.remove('active');
            studioTab.classList.add("active");
          } else if (res == 1) {
            var studioTab: any = document.getElementById("nav-home-tab");
            var freelancerTab: any = document.getElementById('nav-profile-tab');
            subsTab.classList.remove('active');
            console.log("subsTab>>>after remove class>>", subsTab);
            studioTab.setAttribute("aria-selected", "false");
            freelancerTab.classList.add("active");
            freelancerTab.setAttribute("aria-selected", "true");
          } else {
            subsTab.classList.remove('active');
            eqipmentTab.classList.add("active");
          }
        }, 100);
        this.subscriptionType = res;
        this.getSubscriptionList(this.subscriptionType);
      }
    })
    if (this.subscriptionType == "") {
      this.getSubscriptionList(0);
    }

    this.getUserLoggedinStatus();

    if(this.isUserLoggedin) {
      this.getUserDetails();
      this.getAllBuySubscriptionList();
    }
  }

  ngOnDestroy() {
    this.subscriptionSubject.unsubscribe();
  }

  getUserLoggedinStatus() {
    const accessToken = localStorage.getItem('access_token');
    this.isUserLoggedin = accessToken ? true : false
  }

  getSubscriptionList(type: any) {
    const data = {
      subs_for: type
    };
    this.rest.getSubscriptionList(data).subscribe((res: any) => {
      if (res.success) {
        this.subscriptionList = res.response[0];
        this.topupsubscriptionList = res.response[1];
      }
    })
  }

  subscriptionsType(type: any) {
    this.getSubscriptionList(type);
  }

  getUserDetails() {
    const data = {
      userId: this.userId,
      userType: this.userType
    };
    this.rest.getUserDetials(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response.length > 0) {
          this.studioName = res.response[0].orgName;
          this.email = res.response[0].email;
          this.mobile = res.response[0].mobile;
        }
      }
    });
  }

  payForSubscription(subs_data: any) {
    if(this.userType == '0' && subs_data.subs_for != 0) {
      this.common.showAlertMessage('You cannot buy this subscription', this.common.errContent);
      return
    }
    if(this.userType == '1' && subs_data.subs_for != 1) {
      this.common.showAlertMessage('You cannot buy this subscription', this.common.errContent);
      return
    }
    if(this.userType == '2' && subs_data.subs_for != 2) {
      this.common.showAlertMessage('You cannot buy this subscription', this.common.errContent);
      return
    }

    // for razorpay
    // this.createOrder(subs_data);

    if(environment.production) {
      if(this.isUserLoggedin) {
        if(this.main_jobs_remaining > 0 && subs_data.subs_type == 0) {
          this.common.showAlertMessage('You already have an active plan', this.common.errContent)
        } else {
          this.initiatePayment(subs_data);
        }
      }
      else {
        this.common.showAlertMessage('Please login to buy subscription', this.common.errContent)
      }
    } else {
      if(this.isUserLoggedin) {
        if(this.main_jobs_remaining > 0 && subs_data.subs_type == 0) {
          this.common.showAlertMessage('You already have an active plan', this.common.errContent)
        } else {
          this.buySubscription(subs_data);
        }
      }
      else {
        this.common.showAlertMessage('Please login to buy subscription', this.common.errContent)
      }
    }
  }

  buySubscription(subs_data: any) {
    const data = {
      no_of_jobs : subs_data.no_of_jobs,
      subs_for : subs_data.subs_for,
      subs_id : subs_data.subs_id,
      subs_type : subs_data.subs_type,
      final_amount: subs_data.final_amount,
      transaction_id: "kfkjdsk9288d9dkfjlkdd",
      response_code: "SUCCESS",
      validity : subs_data.validity,
      userId : this.userId,
      userType : this.userType
    }
    this.rest.buySubscription(data).subscribe((res: any) => {
      if(res.success) {
          this.common.showAlertMessage(res.message, this.common.succContent);
      }
    })
  }

  initiatePayment(subs_data: any) {
    const data = {
      amount: subs_data.final_amount,
      mobile: this.mobile
    }
    this.rest.initiatePayment(data).subscribe((res: any) => {
      if(res && res.url) {
        localStorage.setItem('subsData', JSON.stringify(subs_data));
        window.location.href = res.url;
      }
    })
  }

  getAllBuySubscriptionList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      limit: 10,
      offset: 0
    };
    this.rest.getAllBuySubscriptionList(data).subscribe((res: any) => {
      if (res.success) {
        this.buysubscriptionList = res.response;
        this.buy_subs_id = res.response[0].buy_subs_id;
        this.subscription_end_date = res.response[0].end_date;
        this.main_jobs_remaining = res.main_jobs_remaining;
      }
    })
  }


  // ------------------------------------------------------ For Razorpay ------------------------------------------------ 
    // createOrder(subs_data: any) {
  //   const data = {
  //     amount: subs_data.final_amount,
  //     currency: 'INR',
  //     notes: {}
  //   }
  //   this.rest.createOrder(data).subscribe((res: any) => {
  //     if(res.success) {
  //       const options = {
          // key: res.key_id, // Your Razorpay key ID
          // amount: res.amount, // Amount in paise
          // currency: data.currency,
          // name: 'Studionomy',
          // description: 'Test Transaction',
          // order_id: res.order_id, // Order ID received from the server
          // handler: (response: any) => {
            // Handle successful payment here
            // console.log('Payment successful:', response);
            // Optionally, send payment details to your server for verification and order confirmation
  //           this.verifyPayment(response, subs_data)
  //         },
  //         prefill: {
  //           name: this.studioName,
  //           email: this.email,
  //           contact: this.mobile
  //         },
  //         theme: {
  //           color: '#3399cc'
  //         }
  //       };
  //       const rzp = new (window as any).Razorpay(options);
  //       rzp.open();
  //     }
  //   })
  // }


  // verifyPayment(response: any, subs_data: any) {
  //   const data = {
  //     razorpay_order_id: response.razorpay_order_id,
  //     razorpay_payment_id: response.razorpay_payment_id,
  //     razorpay_signature: response.razorpay_signature
  //   }
  //   this.rest.verifyPayment(data).subscribe((res: any) => {
  //     if(res.success) {
  //       console.log('payment verify res>>>', res);
  //       this.common.showAlertMessage(res.message, this.common.succContent);
  //       this.buySubscription(subs_data, response)
  //       this.router.navigate(['payment-success'], {
  //         queryParams: {
  //           orderId: response.razorpay_order_id,
  //           paymentId: response.razorpay_payment_id,
  //           amount: subs_data.final_amount,
  //           paymentDate: new Date().toISOString().split('T')[0]
  //         }
  //       });
  //     } else {
  //       this.common.showAlertMessage('Payment could not be verified', this.common.errContent);
  //     }
  //   })
  // }
}
