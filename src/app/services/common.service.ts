import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  subscriptionSubject = new Subject<any>();
  logoutSubject = new Subject<any>();
  inventorySubject = new Subject<any>();
  alertShowTime = 4000;
  errContent = "Error"
  succContent = "Ok"
  pageList: any = [
    { name: '20', value: '20' },
    { name: '30', value: '30' },
    { name: '40', value: '40' },
    { name: '50', value: '50' },
    { name: '60', value: '60' },
    { name: '70', value: '70' },
    { name: '80', value: '80' },
    { name: '90', value: '90' },
    { name: '100', value: '100' }
  ]
  monthList: any = [
    { name: 'January', value: '1' },
    { name: 'February', value: '2' },
    { name: 'March', value: '3' },
    { name: 'April', value: '4' },
    { name: 'May', value: '5' },
    { name: 'June', value: '6' },
    { name: 'July', value: '7' },
    { name: 'August', value: '8' },
    { name: 'September', value: '9' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' },
  ]

  skillList: any = [
    { name: 'Photographer', value: 'Photographer' },
    { name: 'Videographer', value: 'Videographer' },
    { name: 'Cinematographer', value: 'Cinematographer' },
    { name: 'Dronographer', value: 'Dronographer' },
    { name: 'Helper', value: 'Helper' },
    { name: 'Lightman', value: 'Lightman' },
    { name: 'Cine Camera Operater', value: 'Cine Camera Operater' },
  ]

  specializationList: any = [
    { name: 'Photographer; Videographer', value: 'Photographer; Videographer'},
    { name: 'Photographer; Videographer; Candidographer; Cinematographer', value: 'Photographer; Videographer; Candidographer; Cinematographer'},
    { name: 'Photographer; Videographer; Candidographer; Cinematographer; Dronographer', value: 'Photographer; Videographer; Candidographer; Cinematographer; Dronographer'},
    { name: 'Photographer; Videographer; Candidographer; Cinematographer; Dronographer; LED operator', value: 'Photographer; Videographer; Candidographer; Cinematographer; Dronographer; LED operator'}
  ]

  rejectCheckTime = 4;

  constructor(private snackBar: MatSnackBar) { }

  showAlertMessage(content: any, action: any) {
    this.snackBar.open(content, action, {
      duration: this.alertShowTime,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  mailFormatCheck(email: any) {
    const format: any = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (format.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  phoneNumberFormat(phoneNo: any) {
    const phoneNo_format = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (phoneNo_format.test(phoneNo)) {
      return true;
    } else {
      return false;
    }
  }
  amountFormat(amount: any) {
    const amount_format = /^(\d+(\.\d*)?|\.\d+)$/;
    if (amount_format.test(amount)) {
      return true;
    } else {
      return false;
    }
  }
  convertDateTime(date: any) {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDate;
  }
  
  convertOnlyDate(date: any) {
    const parts = date.split("-");
    const convertedDateString = `20${parts[2]}-${parts[1]}-${parts[0]}`;
    return convertedDateString;
  }

  dateFormatYearMonthDate(date: any) {
    var dateComponents = date.split('-');
    var day = dateComponents[0];
    var month = dateComponents[1];
    var year = dateComponents[2];
    if (year.length === 2) {
      var currentYear = new Date().getFullYear().toString().slice(0, 2);
      year = currentYear + year;
    }
    var outputDate = year + '-' + month + '-' + day;

    return outputDate;
  }

  dateRange(startDate: any, endDate: any) {
    let currentDate = startDate;
    let dateList = [];
    while (currentDate <= endDate) {
      let dateString = currentDate
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-');
      dateList.push({
        name: `${dateString}`,
        value: `${dateString}`,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateList;
  }

  generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000)
    return otp.toString();
  }
}
