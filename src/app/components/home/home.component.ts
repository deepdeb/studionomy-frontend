import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  feedbackList: any = [];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: true,
    autoplay: true,
    autoplayTimeout: 4000
  };
  imagePath = this.rest.imagePath;

  constructor(private router: Router, private common: CommonService, private rest: RestService) { }

  ngOnInit() {
    this.getFeedbackList();
  }

  goToSubscription(type: any) {
    this.common.subscriptionSubject.next(type);
    this.router.navigate(['/subscription']);
  }

  // goToRegister(type: any) {
  //   this.common.registerSubject.next(type);
  //   var mobile: any = document.getElementById("offcanvasNavbar");
  //   mobile.style.visibility = "hidden";
  //   var mobile2: any = document.getElementsByClassName("offcanvas-backdrop fade show");
  //   for (var i = 0; i < mobile2.length; i++) {
  //     mobile2[i].classList.remove("show");
  //   }
  //   this.router.navigate(['/register/' + type]);

  // }

  goToRegisterEquipmentOwner() {
    var mobile: any = document.getElementById("offcanvasNavbar");
    mobile.style.visibility = "hidden";
    var mobile2: any = document.getElementsByClassName("offcanvas-backdrop fade show");
    for (var i = 0; i < mobile2.length; i++) {
      mobile2[i].classList.remove("show");
    }
    this.router.navigate(['/register-equipment-owner']);

  }

  goToRegisterFreelancer () {
    var mobile: any = document.getElementById("offcanvasNavbar");
    mobile.style.visibility = "hidden";
    var mobile2: any = document.getElementsByClassName("offcanvas-backdrop fade show");
    for (var i = 0; i < mobile2.length; i++) {
      mobile2[i].classList.remove("show");
    }
    this.router.navigate(['/register-freelancer']);
  }

  goToRegisterStudio() {
    var mobile: any = document.getElementById("offcanvasNavbar");
    mobile.style.visibility = "hidden";
    var mobile2: any = document.getElementsByClassName("offcanvas-backdrop fade show");
    for (var i = 0; i < mobile2.length; i++) {
      mobile2[i].classList.remove("show");
    }
    this.router.navigate(['/register-studio-owner']);
  }

  getFeedbackList() {
    this.rest.getFeedbackList().subscribe((res: any) => {
      if (res.success) {
        this.feedbackList = res.response;
      }
    })
  }

}
