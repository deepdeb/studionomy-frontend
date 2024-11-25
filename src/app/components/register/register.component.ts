import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationTypeCheck = '' as any;
  registrationType = "" as any;
  studioName = "";
  name = "";
  skillList = this.common.skillList;
  skill = "" as any;
  skillsString = '';
  address = "";
  dropdownSkillSettings: any = {};
  location = "";
  city = "";
  pin = "";
  country = "1" as any;
  state = "" as any;
  phoneNo = "";
  altPhoneNo = "";
  email = "";
  reference = "" as any;
  workImg1 = "";
  profileImg = "";
  workImg3 = "";
  aboutusImg = "";
  reffeedbackImg = "";
  aboutYouself = "";
  aboutWork = "";
  aboutReference = "";
  jdLink = "";
  websiteLink = "";
  fbLink = "";
  instaLink = "";
  youtubeLink = "";
  linkedInLink = "";
  userName = "";
  password = "";
  stateList: any = [];
  cityList: any = [];
  disabledSubmit: boolean = false;
  counter = 0;
  registerSubject: any;
  passcode = "";
  imagePath = this.rest.imagePath;
  constructor(private router: Router, private rest: RestService, private activateRouter: ActivatedRoute, private common: CommonService) {
    this.registrationTypeCheck = this.activateRouter.snapshot.url[0].path;
    if(this.registrationTypeCheck == 'register-studio-owner') {
      this.registrationType = 0;
    }
    else if(this.registrationTypeCheck == 'register-freelancer') {
      this.registrationType = 1;
    }
    else if(this.registrationTypeCheck == 'register-equipment-owner') {
      this.registrationType = 2;
    }
  }
  ngOnInit() {
    this.getStateList();

    this.dropdownSkillSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
  }
  getStateList() {
    this.rest.getStateList().subscribe((res: any) => {
      if (res.success) {
        this.stateList = res.response;
      }
    })
  }

  register() {
    let skillsString = '';
    for (let i = 0; i < this.skill.length; i++) {
      skillsString = skillsString ? skillsString + "," + this.skill[i].value : this.skill[i].value;
    }

    if (this.registrationType == 0) {
      if (this.studioName == "" || this.studioName == null || this.studioName == undefined) {
        this.common.showAlertMessage("Please enter studio name", this.common.errContent);
        return;
      }
    }
    if (this.registrationType == 0) {
      if (this.name == "" || this.name == null || this.name == undefined) {
        this.common.showAlertMessage("Please enter contact person name", this.common.errContent);
        return;
      }
    }

    if (this.registrationType == 1 || this.registrationType == 2) {
      if (this.name == "" || this.name == null || this.name == undefined) {
        this.common.showAlertMessage("Please enter name", this.common.errContent);
        return;
      }
    }

    if (this.address == "" || this.address == null || this.address == undefined) {
      this.common.showAlertMessage("Please enter address", this.common.errContent);
      return;
    }

    if (this.location == "" || this.location == null || this.location == undefined) {
      this.common.showAlertMessage("Please enter location", this.common.errContent);
      return;
    }

    if (this.country == "" || this.country == null || this.country == undefined) {
      this.common.showAlertMessage("Please select country", this.common.errContent);
      return;
    }
    if (this.state == "" || this.state == null || this.state == undefined) {
      this.common.showAlertMessage("Please select state", this.common.errContent);
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

    if (this.phoneNo == "" || this.phoneNo == null || this.phoneNo == undefined) {
      this.common.showAlertMessage("Please enter phone no", this.common.errContent);
      return;
    }

    if (this.phoneNo != null && this.phoneNo != "" && this.phoneNo != undefined) {
      if (this.common.phoneNumberFormat(this.phoneNo) == false) {
        this.common.showAlertMessage("Please enter valid mobile no", this.common.errContent);
        return;
      }
    }

    // if (this.altPhoneNo == "" || this.altPhoneNo == null || this.altPhoneNo == undefined) {
    //   this.common.showAlertMessage("Please enter alternate mobile no", this.common.errContent);
    //   return;
    // }

    if (this.altPhoneNo != null && this.altPhoneNo != "" && this.altPhoneNo != undefined) {
      if (this.common.phoneNumberFormat(this.altPhoneNo) == false) {
        alert(11);
        this.common.showAlertMessage("Please enter valid alternate mobile no", this.common.errContent);
        return;
      }
    }

    if (this.phoneNo == this.altPhoneNo) {
      this.common.showAlertMessage("Alternate mobile no must be different", this.common.errContent);
      return;
    }

    // if (this.email == "" || this.email == null || this.email == undefined) {
    //   this.common.showAlertMessage("Please enter email", this.common.errContent);
    //   return;
    // }

    if (this.email != null && this.email != "" && this.email != undefined) {
      if (this.common.mailFormatCheck(this.email) == false) {

        this.common.showAlertMessage("Please enter valid email", this.common.errContent);
        return;
      }
    }

    if (this.registrationType == 1) {
      if (this.skill == "" || this.skill == null || this.skill == undefined) {
        this.common.showAlertMessage("Please select skill", this.common.errContent);
        return;
      }
    }

    // if (this.reference == "" || this.reference == null || this.reference == undefined) {
    //   this.common.showAlertMessage("Please select reference", this.common.errContent);
    //   return;
    // }


    if (this.userName == "" || this.userName == null || this.userName == undefined) {
      this.common.showAlertMessage("Please enter username", this.common.errContent);
      return;
    }
    if (this.userName.length < 5) {
      this.common.showAlertMessage("Username must be greater than five characters", this.common.errContent);
      return;
    }
    if (this.password.length < 5) {
      this.common.showAlertMessage("Password must be greater than five characters", this.common.errContent);
      return;
    }
    // if(this.passcode == "" || this.passcode == null || this.passcode == undefined) {
    //   this.common.showAlertMessage("Please enter 4-digit Passcode", this.common.errContent);
    // }

    const data = {
      registrationType: this.registrationType.toString(),
      studioName: this.studioName ? this.studioName : null,
      name: this.name ? this.name : null,
      address: this.address ? this.address : null,
      location: this.location ? this.location : null,
      city: this.city ? this.city : null,
      pin: this.pin ? this.pin : null,
      country: this.country,
      state: this.state,
      phoneNo: this.phoneNo,
      altPhoneNo: this.altPhoneNo ? this.altPhoneNo : null,
      email: this.email ? this.email : null,
      // skill: this.skill ? this.skill : null,
      skill: skillsString,
      reference: this.reference ? this.reference : null,
      workImg1: this.workImg1 ? this.workImg1 : null,
      profileImg: this.profileImg ? this.profileImg : null,
      workImg3: this.workImg3 ? this.workImg3 : null,
      aboutusImg: this.aboutusImg ? this.aboutusImg : null,
      reffeedbackImg: this.reffeedbackImg? this.reffeedbackImg: null,
      // workImg1: "this.workImg1",
      // profileImg: "this.profileImg",
      // workImg3: "this.workImg3",
      aboutYouself: this.aboutYouself,
      aboutWork: this.aboutWork,
      aboutReference: this.aboutReference,
      fbLink: this.fbLink,
      instaLink: this.instaLink,
      youtubeLink: this.youtubeLink,
      jdLink: this.jdLink,
      websiteLink: this.websiteLink,
      linkedInLink: this.linkedInLink,
      userName: this.userName,
      password: this.password,
      passcode: this.passcode
    };
    this.disabledSubmit = true;
    this.rest.register(data).subscribe((res: any) => {
      if (res.success) {
        this.disabledSubmit = false;
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.studioName = "";
        this.name = "";
        this.address = "";
        this.location = "";
        this.city = "";
        this.pin = "";
        this.country = "1";
        this.state = "";
        this.phoneNo = "";
        this.altPhoneNo = "";
        this.email = "";
        this.reference = "";
        this.workImg1 = "";
        this.profileImg = "";
        this.workImg3 = "";
        this.aboutusImg = "";
        this.reffeedbackImg = "";
        this.fbLink = "";
        this.instaLink = "";
        this.youtubeLink = "";
        this.jdLink = "";
        this.websiteLink = "";
        this.linkedInLink = "";
        this.aboutReference = "";
        this.aboutWork = "";
        this.aboutYouself = "";
        this.userName = "";
        this.password = "";
        this.passcode = "";
      }
    })
  }

  passwordShowHide() {
    this.counter++;
    var passField: any = document.getElementById('inputpassword19');
    var passview: any = document.getElementById('passview');
    if (this.counter % 2 != 0) {
      passField.setAttribute("type", "text");
      passview.setAttribute("class", "fa fa-fw fa-eye-slash");
    } else {
      passField.setAttribute("type", "password");
      passview.setAttribute("class", "fa fa-fw fa-eye");
    }
  }

  getCityList() {
    var stateName = this.getStateNameById(this.state);
    if (stateName) {
      const data = {
        country: "India",
        state: stateName
      };
      this.rest.getCityList(data).subscribe((res: any) => {
        if (res.error == false) {
          this.cityList = res.data;
        }
      })
    }
  }

  getStateNameById(id: any) {
    const foundState = this.stateList.find((state: any) => state.state_id == id);
    return foundState ? foundState.state_name : null;
  }

  uploadImage(type: 'logo' | 'profilePhoto' | 'workPhoto' | 'aboutusImage' | 'reffeedbackImage'): void {
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
    const file: any = banner1.files;
    if (file.length > 0) {
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
            } else if (type == 'aboutusImage'){
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

  onSkillSelected(event: any) {
  }

}
