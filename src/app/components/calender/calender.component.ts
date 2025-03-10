import { Component, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RestService } from 'src/app/services/rest.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CalendarContentComponent } from '../calendar-content/calendar-content.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestForBookingComponent } from '../request-for-booking/request-for-booking.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})

export class CalenderComponent {
  userType = "" as any;
  currentDate: Date = new Date();
  todayDate = new Date();
  calendarDays: number[] = [];
  selectedDate: Date = new Date();
  events: any = [];
  foundJobDetails: any;
  eventDetails: any;
  buysubscriptionList: any;
  remaining_jobs: any;
  buy_subs_id: any;
  userId: any;
  mainPlanActiveStatus: any;
  //------------------- Request Booking -------------------------//
  bookings = [] as any;
  paymentList: any = [];
  req_id: string = '';
  creditAmount: string = '';
  bookingDetails: any;
  foundBookingDetails: any;
  rejectCheckTime = this.common.rejectCheckTime;
  reqDetails: any;
  subscription_end_date: any;
  name = localStorage.getItem('name')
  rejectionRemark = '' as string
  fl_eo_payment_id = '' as string

  calendarOption: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.events,
    displayEventTime: false,
    eventClick: this.handleDateClick.bind(this),
    eventContent: this.customEventContent.bind(this)
  }

  requestBookingcalendarOption: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.bookings,
    displayEventTime: true,
    eventClick: this.handleDateClickForRequestDetails.bind(this),
    eventContent: this.customEventContentForRequestDetails.bind(this)
  }

  @ViewChild('requestDetails') requestDetailsModal: any;
  @ViewChild('rejectPaymentRemarks') rejectPaymentRemarksModal: any;
  req_to_item: any;

  constructor(private rest: RestService, private dialog: MatDialog, private router: Router, private common: CommonService, private route: ActivatedRoute, private location: Location) {
    this.userType = localStorage.getItem('slUserType');
  }

  ngOnInit(): void {
    // this.getAllBuySubscriptionList();

    this.req_to_item = this.location.getState();

    if (this.userType == 0) {
      this.getAllJob();
    } else {
      this.getAllBooking();
    }
  }
  getAllJob() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
    };
    this.rest.getAllJobList(data).subscribe((res: any) => {
      if (res.success) {
        this.events = [];
        this.eventDetails = res.response;
        res.response.forEach((item: any) => {
          const eventStartDate = new Date(item.job_startDate_calendar)
          const eventEndDate = new Date(item.job_endDate_calendar)
          const color = this.randomColor(eventStartDate, eventEndDate);
          this.events.push({
            // title: item.job_details + " " + "#" + item.job_number,
            title: item.job_details,
            start: eventStartDate,
            end: eventEndDate,
            //color: '#ff761e',
            color: color,
            id: item.job_id,
          });
        });
        this.calendarOption.events = this.events;
      }
    })
  }


  handleDateClick(args: any) {
    var job_id = args.event.id;
    var result: any = this.getJobDetailsById(job_id, this.eventDetails);
    if (result) {
      if(this.req_to_item.item) {
        this.openReqForBookingModal(this.req_to_item.item, result);
      } else {
        this.openCalendarContentModal();
      }
    }
  }

  openCalendarContentModal(): void {
    const dialogRef = this.dialog.open(CalendarContentComponent, {
      width: '750px',
      data: {
        title: 'Job Details',
        content: this.foundJobDetails
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

    openReqForBookingModal(req_to_item: any, result: any): void {

      const details_for_req = { "req_to": req_to_item.userId, "req_to_userType": req_to_item.userType, "req_to_name": req_to_item.name, "req_date": result.job_startDate_calendar, "job_number": result.job_number, "req_to_mobile": req_to_item.mobile };

      // console.log('143>>>>', details_for_req);
  
      const dialogRef = this.dialog.open(RequestForBookingComponent, {
        width: '700px',
        data: {
          content: details_for_req
        }
      });
      dialogRef.componentInstance.requestSent.subscribe(() => {
        this.router.navigate(['booking-calender']);
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
    }

  customEventContent(arg: any) {
    //console.log("args>>>>>",arg);
    const container = document.createElement('div');
    container.innerHTML = arg.event.title;
    container.style.whiteSpace = 'pre-wrap';
    container.style.cursor = 'pointer';
    container.style.fontSize = window.innerWidth >= 1200 ? '12px' : '8px';
    //container.style.background = '#DB81B0';randomColor
    //container.style.background = this.randomColor();
    //container.style.color = '#FFFFFF';
    // container.style.backgroundColor = arg.event.backgroundColor + ' !important';
    return { domNodes: [container] };
  }

  getJobDetailsById(job_id: any, eventArray: any) {
    this.foundJobDetails = eventArray.find((job: any) => job.job_id == job_id);
    // console.log("foundJobDetails>>>>>",this.foundJobDetails);
    return this.foundJobDetails ? this.foundJobDetails : null;
  }

  randomColor(eventStartDate: any, eventEndDate: any): string | null {
    if (eventStartDate == eventEndDate) {
      return '#DB81B0';
    }
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Return the RGB color string
    return `rgb(${r},${g},${b})`;
  }

  //-----------------------------  Request Booking --------------------------------//

  getAllBooking() {
    const data = {
      req_to: Number(localStorage.getItem('slUserId')),
      req_to_userType: Number(localStorage.getItem('slUserType'))
    };
    this.rest.getAllRequestBookingList(data).subscribe((res: any) => {
      if (res.success) {
        this.bookings = [];
        this.bookingDetails = res.response;
        res.response.forEach((item: any) => {
          const bookingDate = new Date(item.req_date).toISOString();
          const color = 'red';
          const background = "red"
          this.bookings.push({
            title: item.orgName + "," + (item.req_status ? item.req_status : 'NA') + "," + (item.update_date ? item.update_date : 'NA'),
            start: bookingDate,
            color: color,
            background: background,
            id: item.req_id,
          });
        });
        this.requestBookingcalendarOption.events = this.bookings;
      }
    })
  }

  handleDateClickForRequestDetails(args: any) {
    this.reqDetails = "";
    var req_id = args.event.id;
    this.reqDetails = this.getRequestDetailsById(req_id, this.bookingDetails);
    if (this.reqDetails) {
      this.openRequestDetailsModal();
    }

  }

  openRequestDetailsModal() {
    // console.log('>>>> req details', this.reqDetails);
    this.req_id = this.reqDetails.req_id;
    if(this.req_id) {
      this.getFreelancerEOPaymentByJob();
    }
    const dialogRef: MatDialogRef<any> = this.dialog.open(this.requestDetailsModal, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  customEventContentForRequestDetails(arg: any) {
    const container = document.createElement('div');
    container.innerHTML = arg.event.title;
    container.style.whiteSpace = 'pre-wrap';
    container.style.cursor = 'pointer';
    container.style.fontSize = window.innerWidth >= 1200 ? '12px' : '8px';
    //container.style.background = '#DB81B0';randomColor
    //container.style.background = this.randomColor();
    //container.style.color = '#FFFFFF';

    //container.style.backgroundColor = arg.event.backgroundColor + ' !important';

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

  getAllBuySubscriptionList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: this.userType,
      limit: 10,
      offset: 0
    };
    this.rest.getAllBuySubscriptionList(data).subscribe((res: any) => {
      if (res.success) {
        this.buysubscriptionList = res.response;
        this.remaining_jobs = res.remaining_jobs;
        this.buy_subs_id = res.response[0].buy_subs_id;
        this.userType = res.response[0].userType;
        this.userId = res.response[0].userId;
        this.subscription_end_date = res.response[0].end_date;
        this.mainPlanActiveStatus = res.response[0].isActive;
      }
    })
  }

  acceptRequest() {
    // if(this.mainPlanActiveStatus == 1 && this.remaining_jobs > 0) {
      const data = {
        req_id: this.reqDetails.req_id,
        reqType: 'accept',
        buy_subs_id: this.buy_subs_id,
        userId: this.userId,
        userType: this.userType
      }
      const timeDiff = new Date(this.reqDetails.req_date).getTime() - this.todayDate.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000*3600*24))
      // if(daysDiff < this.rejectCheckTime) {
      //   this.common.showAlertMessage("Time expired", this.common.errContent)
      // }
      // else {
        const alreadyAccepted = this.bookingDetails.some((booking: { req_date: any; req_status: string; }) => {
          return booking.req_date === this.reqDetails.req_date && booking.req_status === 'accepted'
        })
        if(alreadyAccepted) {
          this.common.showAlertMessage("Already accepted another request on same date", this.common.errContent)
        }
        else {
          this.rest.updateRequest(data).subscribe((res: any) => {
            if(res.success) {
              this.common.showAlertMessage(res.message, this.common.succContent);
              this.getAllBooking();
              this.closeModal();
            }
          })
        }
      // }
    // } else {
    //   this.closeModal();
    //   this.common.showAlertMessage('You do not have an active subscription', this.common.errContent);
    //   this.router.navigate(['subscription'])
    // }
  }

  declineRequest() {
    // if(this.mainPlanActiveStatus == 1) {
      const data = {
        req_id: this.reqDetails.req_id,
        reqType: 'decline',
      }
      const timeDiff = new Date(this.reqDetails.req_date).getTime() - this.todayDate.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000*3600*24))
      if(daysDiff < this.rejectCheckTime) {
        this.common.showAlertMessage("Time expired", this.common.errContent)
      }
      else {
        this.rest.updateRequest(data).subscribe((res: any) => {
          if(res.success) {
            this.common.showAlertMessage(res.message, this.common.succContent);
            this.getAllBooking();
            this.closeModal();
          }
        })
      }
    // } else {
    //   this.closeModal();
    //   this.common.showAlertMessage('You do not have an active subscription', this.common.errContent);
    //   this.router.navigate(['subscription'])
    // }

  }

  getFreelancerEOPaymentByJob() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      req_id: this.req_id
    };
    this.paymentList = [];
    this.rest.getFreelancerEOPaymentByJob(data).subscribe((res: any) => {
      if(res.success) {
        this.paymentList = res.response;
      }
    })
  }

  acceptPayment(item: any) {
    if(!item.credit_amount) {
      this.common.showAlertMessage('Enter credit amount', this.common.errContent)
      return
    }
    const data = {
      fl_eo_payment_id: item.fl_eo_payment_id,
      req_id: item.req_id,
      job_id: item.job_id,
      job_number: item.job_number,
      credit_amount: item.credit_amount
    }
    this.rest.acceptPayment(data).subscribe((res: any) => {
      if(res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.closeModal();
      }
    })
  }

  enterRemarksForPaymentReject(item: any) {
    this.fl_eo_payment_id = item.fl_eo_payment_id
    const dialogRef: MatDialogRef<any> = this.dialog.open(this.rejectPaymentRemarksModal, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  rejectPayment() {
    const data = {
      reject_remarks: this.rejectionRemark,
      fl_eo_payment_id: this.fl_eo_payment_id
    }
    this.rest.rejectPayment(data).subscribe((res: any) => {
      if(res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.closeModal();
      }
    })
  }

}
