import { Component, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RestService } from 'src/app/services/rest.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequestForBookingComponent } from '../request-for-booking/request-for-booking.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-calender',
  templateUrl: './booking-calender.component.html',
  styleUrls: ['./booking-calender.component.css']
})
export class BookingCalenderComponent {
  currentDate = new Date().toISOString();
  bookings = [] as any;
  bookingDetails: any;
  foundBookingDetails: any;
  reqDetails: any;
  phone: any;
  studioName = localStorage.getItem('studioName')
  userId = localStorage.getItem('slUserId');
  userType = localStorage.getItem('slUserType');
  requestBookingcalendarOption: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.bookings,
    displayEventTime: true,
    eventClick: this.handleDateClickForRequestDetails.bind(this),
    eventContent: this.customEventContentForRequestDetails.bind(this)
  }
  @ViewChild('requestDetails') requestDetailsModal: any;

  constructor(private rest: RestService, private dialog: MatDialog, private router: Router, private common: CommonService) { }
  ngOnInit() {
    this.getAllMyReqBooking();
  }

  getAllMyReqBooking() {
    const data = {
      req_from: Number(localStorage.getItem('slUserId')),
      req_from_userType: Number(localStorage.getItem('slUserType'))
    };
    this.rest.getAllMyReqBookingList(data).subscribe((res: any) => {
      if (res.success) {
        this.bookings = [];
        this.bookingDetails = res.response;
        res.response.forEach((item: any) => {
          const bookingDate = new Date(item.req_date).toISOString();
          const req_status = item.req_status ? ',' + item.req_status + ',' : '';
          const update_date = item.update_date ? item.update_date + ',' : '';
          const color = 'white';
          this.bookings.push({
            title: item.job_number + "," + item.freelancerName + "," + item.skills + "\n" + req_status + update_date, 
            start: bookingDate,
            color: color,
            id: item.req_id,
          });
        });
        this.requestBookingcalendarOption.events = this.bookings;
      }
    })
  }

  deleteReqBooking(date: any) {
    const partsDate = date.split('-');
    const formattedDate = `${partsDate[2]}-${partsDate[1]}-${partsDate[0]}`
    const data = {
      req_date: formattedDate,
      req_to: this.reqDetails.req_to,
      req_id: this.reqDetails.req_id,
      req_to_userType: this.reqDetails.req_to_userType,
      job_id: this.reqDetails.job_id,
      job_number: this.reqDetails.job_number,
      userId: this.userId,
      userType: this.userType
    }
    console.log(data)
    this.rest.deleteRequest(data).subscribe((res: any) => {
      if(res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.closeModal();
        this.getAllMyReqBooking();
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }

  editReqBooking() {
    console.log("reqDetails>>>",this.reqDetails)
    this.closeModal();
    const dialogRef: MatDialogRef<any> = this.dialog.open(RequestForBookingComponent, {
      width: '700px',
      data: {
        content: this.reqDetails
      }
    });
    dialogRef.componentInstance.updateReqBookSent.subscribe(() => {
      this.getAllMyReqBooking();
    });

    dialogRef.afterClosed().subscribe({
    });

  }

  whatsappReqBooking() {
    let text = encodeURIComponent(`*Request from: ${this.studioName}, Phone no: ${this.reqDetails.studioMobile}, Address: ${this.reqDetails.address + ", " + this.reqDetails.location}`);
    text += '%0A' + encodeURIComponent(`*Skill required: ${this.reqDetails.skills}`);
    this.reqDetails.message ? text += '%0A' + encodeURIComponent(`*Message: ${this.reqDetails.message}`) : '';
    text += '%0A' + encodeURIComponent(`*Booking for: ${this.reqDetails.req_date}`);
    text += '%0A' + encodeURIComponent(`*Event location: ${this.reqDetails.event_location}`);
    text += '%0A'
    text += '%0A' + encodeURIComponent('Courtest - @Studionomy.com');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${this.reqDetails.freelancerMobile}&text=${text}`;
    window.open(whatsappUrl, '_blank');
  }

  handleDateClickForRequestDetails(args: any) {
    this.reqDetails = "";
    var req_id = args.event.id;
    this.reqDetails = this.getRequestDetailsById(req_id, this.bookingDetails);
    console.log("req details by id >>>",this.reqDetails)
    if (this.reqDetails) {
      this.openRequestDetailsModal();
    }

  }

  openRequestDetailsModal() {
    const dialogRef: MatDialogRef<any> = this.dialog.open(this.requestDetailsModal, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  customEventContentForRequestDetails(arg: any) {
    console.log("arg events>>>", arg.event.title)
    const container = document.createElement('div');
    container.innerHTML = arg.event.title;
    container.style.whiteSpace = 'pre-wrap';
    container.style.cursor = 'pointer';
    container.style.fontSize = window.innerWidth >= 1200 ? '9px' : '8px';
    if(arg.event.title.includes('accepted')) {
      container.style.background = '#03ad51';
    } else if (arg.event.title.includes('declined')) {
      container.style.background = 'red';
    } else {
      container.style.background = 'blue';
    }
    container.style.color = 'white';
    return { domNodes: [container] };
  }
  getRequestDetailsById(req_id: any, requestDetailsArray: any) {
    this.foundBookingDetails = requestDetailsArray.find((req: any) => req.req_id == req_id);
    return this.foundBookingDetails ? this.foundBookingDetails : null;
  }
  closeModal() {
    this.dialog.closeAll();
  }

  dateFormat(date: any) {
    let newdate = new Date(date);
    let day = newdate.getDate().toString().padStart(2, '0');
    let month = (newdate.getMonth() + 1).toString().padStart(2, '0');
    let year = newdate.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }
}
