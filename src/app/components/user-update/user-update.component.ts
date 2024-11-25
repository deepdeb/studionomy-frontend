import { Component } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent {

  userName = "" as any;
  registrationType = "" as any;
  name = "";
  studioName = "";
  email = "";
  mobile = "";
  alt_mobile = "";
  aboutYouself = "";
  aboutReference = "";
  aboutWork = "";
  FBLink = "";
  InstaLink = "";
  YoutubeLink = "";
  jdLink = "";
  websiteLink = "";
  linkedInLink = "";
  workImg1 = "";
  profileImg = "";
  workImg3 = "";
  aboutusImg = "";
  reffeedbackImg = "";
  state_id = "" as any;
  country_id = "" as any;
  pin = "";
  address = "";
  city = "";
  userLocation = "";
  reference = "" as any;
  passcode = "";
  stateList: any = [];
  imagePath = this.rest.imagePath;

  constructor(private rest: RestService, private router: Router, private location: Location, private common: CommonService) {
    this.registrationType = localStorage.getItem('slUserType')
  }

  ngOnInit() {
    this.getStateList();
    this.getUserDetails();
  }
  //------------------------------ Profile update -------------------//
  updateUser() {
    if (this.registrationType == 0) {
      if (this.studioName == "" || this.studioName == null || this.studioName == undefined) {
        this.common.showAlertMessage("Please enter studio name", this.common.errContent);
        return;
      }
    }
    if (this.name == "" || this.name == null || this.name == undefined) {
      this.common.showAlertMessage("Please enter contact person name", this.common.errContent);
      return;
    }
    if (this.address == "" || this.address == null || this.address == undefined) {
      this.common.showAlertMessage("Please enter address", this.common.errContent);
      return;
    }
    if (this.userLocation == "" || this.userLocation == null || this.userLocation == undefined) {
      this.common.showAlertMessage("Please enter location", this.common.errContent);
      return;
    }
    if (this.city == "" || this.city == null || this.city == undefined) {
      this.common.showAlertMessage("Please enter city", this.common.errContent);
      return;
    }
    if (this.pin == "" || this.pin == null || this.pin == undefined) {
      this.common.showAlertMessage("Please enter pin", this.common.errContent);
      return;
    }
    if (this.country_id == "" || this.country_id == null || this.country_id == undefined) {
      this.common.showAlertMessage("Please select country", this.common.errContent);
      return;
    }
    if (this.state_id == "" || this.state_id == null || this.state_id == undefined) {
      this.common.showAlertMessage("Please select state", this.common.errContent);
      return;
    }
    if (this.mobile == "" || this.mobile == null || this.mobile == undefined) {
      this.common.showAlertMessage("Please enter phone no", this.common.errContent);
      return;
    }
    // if (this.mobile != null && this.mobile != "" && this.mobile != undefined) {
    //   if (this.common.phoneNumberFormat(this.mobile) == false) {
    //     this.common.showAlertMessage("Please enter valid phone no", this.common.errContent);
    //     return;
    //   }
    // }
    // if (this.alt_mobile != null && this.alt_mobile != "" && this.alt_mobile != undefined) {
    //   if (this.common.phoneNumberFormat(this.alt_mobile) == false) {
    //     this.common.showAlertMessage("Please enter valid alternate phone no", this.common.errContent);
    //     return;
    //   }
    // }
    if (this.mobile == this.alt_mobile) {
      this.common.showAlertMessage("Alternate phone no must be different", this.common.errContent);
      return;
    }
    // if (this.email == "" || this.email == null || this.email == undefined) {
    //   this.common.showAlertMessage("Please enter email", this.common.errContent);
    //   return;
    // }
    const data = {
      registrationType: this.registrationType,
      userId: localStorage.getItem('slUserId'),
      userName: this.userName,
      studioName: this.studioName ? this.studioName : null,
      name: this.name ? this.name : null,
      address: this.address ? this.address : null,
      location: this.userLocation ? this.userLocation : null,
      city: this.city ? this.city : null,
      pin: this.pin ? this.pin.toString() : null,
      country: this.country_id,
      state: this.state_id,
      phoneNo: this.mobile,
      altPhoneNo: this.alt_mobile ? this.alt_mobile : null,
      email: this.email ? this.email : null,
      reference: this.reference ? this.reference : null,
      passcode: this.passcode ? this.passcode : null,
      workImg1: this.workImg1 ? this.workImg1 : null,
      profileImg: this.profileImg ? this.profileImg : null,
      workImg3: this.workImg3 ? this.workImg3 : null,
      aboutusImg: this.aboutusImg ? this.aboutusImg : null,
      reffeedbackImg: this.reffeedbackImg ? this.reffeedbackImg : null,
      aboutYouself: this.aboutYouself ? this.aboutYouself : null,
      aboutWork: this.aboutWork ? this.aboutWork : null,
      aboutReference: this.aboutReference ? this.aboutReference : null,
      fbLink: this.FBLink ? this.FBLink : null,
      instaLink: this.InstaLink ? this.InstaLink : null,
      youtubeLink: this.YoutubeLink ? this.YoutubeLink : null,
      jdLink: this.jdLink ? this.jdLink : null,
      websiteLink: this.websiteLink ? this.websiteLink : null,
      linkedInLink: this.linkedInLink ? this.linkedInLink : null
    };
    this.rest.userUpdate(data).subscribe((res: any) => {
      if (res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.location.back();
      }
    })
  }

  getUserDetails() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getUserDetials(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response.length > 0) {
          this.userName = res.response[0].userName;
          this.registrationType = res.response[0].userType;
          this.studioName = res.response[0].orgName;
          this.name = res.response[0].name;
          this.mobile = res.response[0].mobile;
          this.alt_mobile = res.response[0].alt_mobile;
          this.email = res.response[0].email;
          this.country_id = res.response[0].country_id;
          this.YoutubeLink = res.response[0].YoutubeLink;
          this.FBLink = res.response[0].FBLink;
          this.websiteLink = res.response[0].websiteLink;
          this.jdLink = res.response[0].jdLink;
          this.linkedInLink = res.response[0].linkedInLink;
          this.InstaLink = res.response[0].InstaLink;
          this.aboutYouself = res.response[0].aboutYouself;
          this.aboutWork = res.response[0].aboutWork;
          this.workImg1 = res.response[0].workImg1;
          this.profileImg = res.response[0].profileImg;
          this.workImg3 = res.response[0].workImg3;
          this.aboutusImg = res.response[0].aboutusImg;
          this.reffeedbackImg = res.response[0].reffeedbackImg;
          this.aboutReference = res.response[0].aboutReference;
          this.state_id = res.response[0].state_id;
          this.pin = res.response[0].pin;
          this.userLocation = res.response[0].location;
          this.address = res.response[0].address;
          this.city = res.response[0].city;
          this.reference = res.response[0].reference;
          this.passcode = res.response[0].passcode;
        }
      }
    })
  }
  getStateList() {
    this.rest.getStateList().subscribe((res: any) => {
      if (res.success) {
        this.stateList = res.response;
      }
    })
  }

  uploadImage(type: 'logo' | 'profilePhoto' | 'workPhoto' | 'aboutusImage' | 'reffeedbackImage') {
    let banner1 = '' as any;
    if(type == 'logo') {
      banner1 = document.getElementById('formFile1') as HTMLInputElement
    } else if (type == 'profilePhoto') {
      banner1 = document.getElementById('formFile2') as HTMLInputElement
    } else if (type == 'workPhoto'){
      banner1 = document.getElementById('formFile3') as HTMLInputElement
    } else if (type == 'aboutusImage'){
      banner1 = document.getElementById('formFile4') as HTMLInputElement
    } else {
      banner1 = document.getElementById('formFile5') as HTMLInputElement
    }
    const file: any = banner1.files
    if(file.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        const fileData = new FormData();
        fileData.append('file', file[0]);
        this.rest.uploadImage(fileData).subscribe((res: any) => {
          if (res.success) {
            if(type == 'logo') {
              this.workImg1 = res.response.newFilename
            } else if (type == 'profilePhoto') {
              this.profileImg = res.response.newFilename
            } else if (type == 'workPhoto') {
              this.workImg3 = res.response.newFilename
            } else if (type == 'aboutusImage') {
              this.aboutusImg = res.response.newFilename
            } else {
              this.reffeedbackImg = res.response.newFilename
            }
            this.common.showAlertMessage(res.message, this.common.succContent);
          } else {
            this.common.showAlertMessage(res.message, this.common.errContent);
          }
        })
      };
    }
  }

  openImage(type: 'logo' | 'profilePhoto' | 'workPhoto' | 'aboutusImage' | 'reffeedbackImage') {
    let toOpenImage = '';
    if(type == 'logo') {
      toOpenImage = this.workImg1
    } else if (type == 'profilePhoto') {
      toOpenImage = this.profileImg
    } else if (type == 'workPhoto'){
      toOpenImage = this.workImg3
    } else if (type == 'aboutusImage'){
      toOpenImage = this.aboutusImg
    } else {
      toOpenImage = this.reffeedbackImg
    }
    const imageUrl = toOpenImage ? `${this.imagePath}${toOpenImage}` : 'assets/img/background/no-photo.png';
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  }
}
