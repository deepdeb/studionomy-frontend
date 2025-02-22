import { Component, ViewChild } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  userName = "";
  password = "";
  counter = 0;
  studioRole: any;
  dialogRef: any;
  OTP: any;
  passcode: any;
  userId: any;
  userType: any;
  access_token: any;

  @ViewChild('roleVerify') roleVerifyModal: any;
  @ViewChild('enterOTP') enterOTPModal: any;

  constructor(private rest: RestService, private common: CommonService, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
  }

  login() {
    if (!this.userName) {
      this.common.showAlertMessage("Please enter username", this.common.errContent);
      return;
    }
    if (!this.password) {
      this.common.showAlertMessage("Please enter password", this.common.errContent);
      return;
    }
    const data = {
      userName: this.userName,
      password: this.password
    };
    this.rest.login(data).subscribe((res: any) => {
      if (res.success) {
        this.userId = res.response[0].userId;
        this.userType = res.response[0].userType;
        this.access_token = res.access_token;
        this.passcode = res.response[0].passcode;
        if (res.response[0].userType == 0) {
          this.openModal();
        } else {
          this.setLocalStorageItems();
          this.router.navigate(['/user']);
        }
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }

  passwordShowHide() {
    this.counter++;
    var passField: any = document.getElementById('exampleInputconfirm6');
    var passview: any = document.getElementById('passview');
    if (this.counter % 2 != 0) {
      passField.setAttribute("type", "text");
      passview.setAttribute("class", "fa fa-fw fa-eye-slash");
    } else {
      passField.setAttribute("type", "password");
      passview.setAttribute("class", "fa fa-fw fa-eye");
    }
  }

  openModal(): void {
    this.dialogRef = this.dialog.open(this.roleVerifyModal, {
      width: '300px',
      disableClose: true
    })
    this.dialogRef.afterClosed().subscribe(() => {
    });
  };

  nextStep() {
    if (this.studioRole === 'employee' && this.dialogRef) {
      this.closeModal();
    } else {
      if (this.dialogRef) {
        this.dialogRef.close();
      }
      this.dialogRef = this.dialog.open(this.enterOTPModal, {
        width: '300px',
        disableClose: true
      })
    }
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.setLocalStorageItems();
    this.router.navigate(['/user']);
  }

  handleIncorrectOTP() {
    this.common.showAlertMessage("Incorrect Passcode", this.common.errContent)
  }

  setLocalStorageItems() {
    localStorage.setItem('slUserId', this.userId);
    localStorage.setItem('slUserType', this.userType);
    localStorage.setItem('access_token', this.access_token);
    this.studioRole ? localStorage.setItem('studioRole', this.studioRole) : '';
  }
}
