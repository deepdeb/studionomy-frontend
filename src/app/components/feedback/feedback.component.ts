import { Component } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  name = "";
  mobile = "";
  alt_mobile = "";
  email = "";
  profileImg = "" as any;
  feedback_details = "";
  buttonDisabled: boolean = false;

  constructor(private rest: RestService, private common: CommonService) { }
  ngOnInit() {
    this.buttonDisabled = false;
    if (localStorage.getItem('slUserId')) {
      this.getUserDetails();
    }
  }
  getUserDetails() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getUserDetials(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response) {
          this.name = res.response[0].name;
          this.mobile = res.response[0].mobile;
          this.alt_mobile = res.response[0].alt_mobile;
          this.email = res.response[0].email;
        }
      }
    })
  }

  submitFeedback() {
    if (this.name == "" || this.name == null || this.name == undefined) {
      this.common.showAlertMessage("Please enter name", this.common.errContent);
      return;
    }
    // if (this.mobile == "" || this.mobile == null || this.mobile == undefined) {
    //   this.common.showAlertMessage("Please enter mobile no", this.common.errContent);
    //   return;
    // }
    // if (this.mobile != null) {
    //   if (this.common.phoneNumberFormat(this.mobile) == false) {
    //     this.common.showAlertMessage("Please enter valid mobile no", this.common.errContent);
    //     return;
    //   }
    // }
    // if (this.alt_mobile != null) {
    //   if (this.common.phoneNumberFormat(this.alt_mobile) == false) {
    //     this.common.showAlertMessage("Please enter valid alternate mobile no", this.common.errContent);
    //     return;
    //   }
    // }
    // if (this.mobile == this.alt_mobile) {
    //   this.common.showAlertMessage("Alternative mobile no must be different", this.common.errContent);
    //   return;
    // }
    // if (this.email == "" || this.email == null || this.email == undefined) {
    //   this.common.showAlertMessage("Please enter email id", this.common.errContent);
    //   return;
    // }
    // if (this.profileImg == "" || this.profileImg == null || this.profileImg == undefined) {
    //   this.common.showAlertMessage("Please upload profile picture", this.common.errContent);
    //   return;
    // }
    // if (this.feedback_details == "" || this.feedback_details == null || this.feedback_details == undefined) {
    //   this.common.showAlertMessage("Please enter feedback", this.common.errContent);
    //   return;
    // }
    const data = {
      userId: localStorage.getItem('slUserId') ? localStorage.getItem('slUserId') : 0,
      name: this.name,
      mobile: this.mobile,
      alt_mobile: this.alt_mobile,
      email: this.email,
      profileImg: this.profileImg,
      feedback_details: this.feedback_details
    };
    this.rest.submitFeedback(data).subscribe((res: any) => {
      if (res.success) {
        this.profileImg = "";
        this.feedback_details = "";
        this.name = "";
        this.mobile = "";
        this.alt_mobile = "";
        this.email = "";
        this.buttonDisabled = true;
        this.common.showAlertMessage(res.message, this.common.succContent);
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }
  uploadImage(): void {
    const banner1 = document.getElementById('profileImage') as HTMLInputElement;
    const file: any = banner1.files;
    if (file.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        const fileData = new FormData();
        fileData.append('file', file[0]);
        this.rest.uploadImage(fileData).subscribe((res: any) => {
          if (res.success) {
            this.profileImg = res.response.newFilename;
            this.common.showAlertMessage(res.message, this.common.succContent);
          } else {
            this.common.showAlertMessage(res.message, this.common.errContent);
          }
        })
      };
    }
  }
}
