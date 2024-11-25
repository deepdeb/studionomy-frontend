import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailureComponent implements OnInit{
  orderId = '' as any;
  message = '' as any;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.orderId = params['orderId']
        this.message = params['message']
      })
  }

  retryPayment() {
    this.router.navigate(['subscription'])
  }
}
