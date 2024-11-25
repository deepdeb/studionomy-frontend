import { Component } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  name = "";
  mobile = "";
  alt_mobile = "";
  email = "";
  querie_details = "";
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
      userId: localStorage.getItem('slUserId')
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

  submitQuery() {
    if (this.name == "" || this.name == null || this.name == undefined) {
      this.common.showAlertMessage("Please enter name", this.common.errContent);
      return;
    }
    if (this.mobile == "" || this.mobile == null || this.mobile == undefined) {
      this.common.showAlertMessage("Please enter mobile no", this.common.errContent);
      return;
    }
    if (this.mobile) {
      if (this.common.phoneNumberFormat(this.mobile) == false) {
        this.common.showAlertMessage("Please enter valid mobile no", this.common.errContent);
        return;
      }
    }
    if (this.alt_mobile) {
      if (this.common.phoneNumberFormat(this.alt_mobile) == false) {
        this.common.showAlertMessage("Please enter valid alternate mobile no", this.common.errContent);
        return;
      }
    }
    if (this.mobile == this.alt_mobile) {
      this.common.showAlertMessage("Alternative mobile no must be different", this.common.errContent);
      return;
    }
    if (this.email == "" || this.email == null || this.email == undefined) {
      this.common.showAlertMessage("Please enter email id", this.common.errContent);
      return;
    }
    if (this.querie_details == "" || this.querie_details == null || this.querie_details == undefined) {
      this.common.showAlertMessage("Please enter query", this.common.errContent);
      return;
    }

    const data = {
      userId: localStorage.getItem('slUserId') ? localStorage.getItem('slUserId') : 0,
      name: this.name,
      mobile: this.mobile,
      alt_mobile: this.alt_mobile,
      email: this.email,
      querie_details: this.querie_details
    };
    this.rest.submitQuery(data).subscribe((res: any) => {
      if (res.success) {
        if (localStorage.getItem('slUserId')) {
          this.name = "";
          this.email = "";
          this.mobile = "";
          this.alt_mobile = "";
          this.querie_details = "";
          this.buttonDisabled = true;
        } else {
          this.name = "";
          this.email = "";
          this.mobile = "";
          this.alt_mobile = "";
          this.querie_details = "";
          this.buttonDisabled = true;
        }
        this.common.showAlertMessage(res.message, this.common.succContent);
      }
    })
  }

}
