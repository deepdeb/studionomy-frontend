import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userId = "" as any;
  userType = "" as any;
  totalInventary = 0;
  logoutSubject: any;
  inventorySubject: any;
  userProfileImage = "" as any;

  imagePath = this.rest.imagePath;

  constructor(private router: Router, private common: CommonService, private rest: RestService) {
    if (localStorage.getItem('slUserId')) {
      this.userId = localStorage.getItem('slUserId');
      this.userType = localStorage.getItem('slUserType');
      this.getUserDetails();
    }
  }
  ngOnInit() {
    this.logoutSubject = this.common.logoutSubject.subscribe((res: any) => {
      if (res == 1) {
        this.userId = "";
        this.userType = "";
      }
    })
    this.inventorySubject = this.common.inventorySubject.subscribe((res: any) => {
      if (res == 1) {
        this.getUserDetails();
      }
    })
  }
  ngOnDestroy() {
    this.logoutSubject.unsubscribe();
    this.inventorySubject.unsubscribe();
  }


  // submitForForgotPassword() {
  //   if (this.emailForForgot == "" || this.emailForForgot == null || this.emailForForgot == undefined) {
  //     this.common.showAlertMessage("Please enter email", this.common.errContent);
  //     return;
  //   }
  //   const data = {
  //     email: this.emailForForgot
  //   };
  //   this.rest.emailSubmitForForgot(data).subscribe((res: any) => {
  //     if (res.success) {
  //       this.emailForForgot = "";
  //       this.common.showAlertMessage(res.message, this.common.succContent);

  //     }
  //   })
  // }

  // finalSubmitForForgotPassword() {
  //   if (this.otp == "" || this.otp == null || this.otp == undefined) {
  //     this.common.showAlertMessage("Please enter otp", this.common.errContent);
  //     return;
  //   }
  //   if (this.newPassword == "" || this.newPassword == null || this.newPassword == undefined) {
  //     this.common.showAlertMessage("Please enter new password", this.common.errContent);
  //     return;
  //   }
  //   if (this.confirmPassword == "" || this.confirmPassword == null || this.confirmPassword == undefined) {
  //     this.common.showAlertMessage("Please enter confirm password", this.common.errContent);
  //     return;
  //   }
  //   if (this.confirmPassword != this.newPassword) {
  //     this.common.showAlertMessage("New password and confirm password must be same", this.common.errContent);
  //     return;
  //   }
  //   const data = {
  //     otp: this.otp,
  //     newPassword: this.newPassword,
  //     email: this.emailForForgot,
  //     userName: this.userName
  //   };
  //   this.rest.changePassword(data).subscribe((res: any) => {

  //   })

  // }

  getUserDetails() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getUserDetials(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response.length > 0) {
          this.totalInventary = res.response[0].totalInventary;
          this.userProfileImage = res.response[0].profileImg
        }
      }
    })
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
  
  goToHome() {
    this.router.navigate(['/']);
  }

  goToAbout() {
    this.router.navigate(['/about-us']);
  }

  goToProfile(id: any) {
    this.router.navigate(['/user']);
  }
  goToSubscription() {
    this.router.navigate(['/subscription']);
  }

  goToFeedback() {
    this.router.navigate(['/feedback']);
  }

  goToQuery() {
    this.router.navigate(['/query']);
  }

  goToContactus() {
    this.router.navigate(['/contact-us'])
  }

  goToJob() {
    if (this.totalInventary > 0) {
      this.router.navigate(['/job/0']);
    } else {
      this.common.showAlertMessage("First add your inventary then add the job", this.common.errContent);
      return;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.clear();
    this.common.logoutSubject.next(1);
    this.router.navigate(['/']);
  }

  goToWebsiteTour() {
    this.router.navigate(['/website-tour']);
  }

}
