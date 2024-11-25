import { Component, ViewChild } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  toRegisteredMail: any;
  OTP: any;
  sentOTP: any;
  emailSentMsg: any;
  changePassword: any;
  confirmPassword: any;
  dialogRef: any;

  @ViewChild('OTPEnter') OTPEnterModal: any

  constructor(private rest: RestService, private common: CommonService, private router: Router, private dialog: MatDialog) { }

  getDetailsByEmail() {
    const data = {
      toRegisteredMail: this.toRegisteredMail
    }
    this.rest.getUserDetailsByEmail(data).subscribe((res: any) => {
      if(res.success) {
        this.sentOTP = this.common.generateOTP();
        this.sendMail();
        this.openOTPEnterModal();
      } else {
        this.common.showAlertMessage('Email not registered', this.common.errContent)
      }
    })
  }

  sendMail() {
    const data = {
      toRegisteredMail: this.toRegisteredMail,
      sentOTP: this.sentOTP
    }
    this.rest.sendMail(data).subscribe((res: any) => {
      if (res.success) {
        this.emailSentMsg = res.message
      }
    })
  }

  checkAndUpdatePassword() {
    if(this.OTP === Number(this.sentOTP)) {
      if((this.changePassword && this.confirmPassword) && (this.changePassword === this.confirmPassword)) {
        const data = {
          changePassword: this.changePassword,
          toRegisteredMail: this.toRegisteredMail
        }
        this.rest.updatePassword(data).subscribe((res: any) => {
          if(res.success) {
            this.common.showAlertMessage(res.message, this.common.succContent);
            this.OTP = '';
            this.changePassword = '';
            this.confirmPassword = '';
            this.sentOTP = '';
            this.toRegisteredMail = '';
            this.closeModal()
          }
        })
      } else {
        this.common.showAlertMessage("Passwords do not match", this.common.errContent);
      }
    } else {
      this.common.showAlertMessage("Incorrect OTP entered", this.common.errContent);
    }
  }

  openOTPEnterModal() {
    this.dialogRef = this.dialog.open(this.OTPEnterModal, {
      width: '550px',
    });

    this.dialogRef.afterClosed().subscribe({
    });
  }

  closeModal() {
    if(this.dialogRef) {
      this.dialogRef.close();
    }
    this.router.navigate(['/login'])
  }
}
