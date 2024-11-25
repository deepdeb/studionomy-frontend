import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {

  userId = "" as any;
  profile_share = "" as any;
  userType = "" as any;
  name = "";
  studioName = "";
  email = "";
  mobile = "";
  alt_mobile = "";
  address1 = "";
  address2 = "";
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
  workImg2 = "";
  workImg3 = "";
  country = "1" as any;
  equipmentList: any = [];
  equipmentlimit: number = 5;
  equipmentoffset: number = 0;

  constructor(private rest: RestService, private common: CommonService, private activateRoute: ActivatedRoute) {

    this.userId = this.activateRoute.snapshot.paramMap.get('id');
    this.userType = localStorage.getItem('slUserType');
  }
  ngOnInit() {
    this.getUserDetails();
    this.getEquipmentList();
    var modal: any = document.getElementsByClassName('modal-backdrop fade show');
    for (var i = 0; i < modal.length; i++) {
      var classList: any = modal[i].className;
      classList = classList.replace(' show', '');
      modal[i].className = classList;
    }
    var bodymodal: any = document.getElementsByClassName('mat-typography');
    for (var i = 0; i < bodymodal.length; i++) {
      bodymodal[i].style.overflow = 'scroll';
    }
    var mClass: any = document.getElementsByClassName('modal-backdrop fade');
    if (mClass) {
      for (var m = 0; m < mClass.length; m++) {
        mClass[m].style.display = 'none';
      }
    }
  }


  getUserDetails() {
    const data = {
      userId: this.userId
    };
    this.rest.getUserPublicInfo(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response.length > 0) {
          this.profile_share = res.response[0].profile_share;
          this.studioName = res.response[0].orgName;
          this.name = res.response[0].name;
          this.mobile = res.response[0].mobile;
          this.alt_mobile = res.response[0].alt_mobile;
          this.email = res.response[0].email;
          this.country = res.response[0].country_id;
          this.YoutubeLink = res.response[0].YoutubeLink;
          this.FBLink = res.response[0].FBLink;
          this.websiteLink = res.response[0].websiteLink;
          this.jdLink = res.response[0].jdLink;
          this.linkedInLink = res.response[0].linkedInLink;
          this.InstaLink = res.response[0].InstaLink;
          this.aboutYouself = res.response[0].aboutYouself;
          this.aboutWork = res.response[0].aboutWork;
          this.aboutReference = res.response[0].aboutReference;
          if (this.country == 1) {
            this.country = "India";
          }
          this.address1 = res.response[0].address + "," + res.response[0].location;
          this.address2 = res.response[0].city + "," + res.response[0].pin + "," + res.response[0].state_name;
        }
      }
    })
  }

  getEquipmentList() {
    const data = {
      userId: this.userId
    };
    this.rest.getEquipmentPublicInfo(data).subscribe((res: any) => {
      if (res.success) {
        this.equipmentList = [];
        this.equipmentList = res.response;
      }
    })
  }
  gotoLink(url: any) {
    window.open(url);
  }

}
