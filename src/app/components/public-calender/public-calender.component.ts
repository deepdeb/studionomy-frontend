import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { RequestForBookingComponent } from '../request-for-booking/request-for-booking.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-public-calender',
  templateUrl: './public-calender.component.html',
  styleUrls: ['./public-calender.component.css']
})
export class PublicCalenderComponent {
  job_startDate: any;
  job_endDate: any;
  dateList: any = [];
  req_to_name: any;
  req_to_mobile: any;
  constructor(private dialog: MatDialog, private route: ActivatedRoute, private rest: RestService, private router: Router, private common: CommonService) { }
  req_to = "" as any;
  req_to_userType = "" as any;
  job_id = '' as any;
  job_number = "" as any;
  req_date = "";
  req_details = {} as any;
  currentDate: any = new Date().toISOString().split("T")[0];
  bookings: any = [];
  bookingDetails = [] as any;
  calendarOption: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.bookings,
    displayEventTime: false,
    eventClick: this.handleDateClick.bind(this),
    eventContent: this.customEventContent.bind(this),
    dateClick: this.handleDateClick.bind(this)
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.req_to = params['requestTo'];
      this.req_to_userType = params['req_to_userType'];
      this.req_to_name = params['requestToName'];
      this.req_to_mobile = params['mobile'];
      this.job_number = params['job_number'];
      this.job_number ? this.getJobDetails() : '';
    });
    this.getAllBooking();
  }

  handleDateClick(args: any) {
    this.req_date = args.dateStr;
    // console.log(this.req_date, this.dateList);
    const req_dateParts = this.req_date.split('-');
    const reqDateFormatted = `${req_dateParts[2]}-${req_dateParts[1]}-${req_dateParts[0].substring(2)}`
    const isDateContains = this.checkIsDateContains(this.dateList, reqDateFormatted);
    if(!isDateContains) {
      const msgToShow = "Invalid date selected, \nselect from " + this.dateList.map((date: any) => date.name).join(', ')
      this.common.showAlertMessage(msgToShow, this.common.errContent);
      return;
    }
    this.openModal();
  }
  customEventContent(arg: any) {
    const container = document.createElement('div');
    container.innerHTML = arg.event.title;
    container.style.whiteSpace = 'pre-wrap';
    container.style.cursor = 'pointer';
    container.style.fontSize = window.innerWidth >= 1200 ? '12px' : '8px';
    container.style.background = 'green';
    container.style.color = 'white';

    //container.style.backgroundColor = arg.event.backgroundColor + ' !important';

    return { domNodes: [container] };

  }

  openModal(): void {
    this.req_details = { "req_to": this.req_to, "req_to_userType": this.req_to_userType, "req_to_name": this.req_to_name, "req_date": this.req_date, "job_number": this.job_number, "req_to_mobile": this.req_to_mobile };
    const dialogRef = this.dialog.open(RequestForBookingComponent, {
      width: '700px',
      data: {
        content: this.req_details
      }
    });

    dialogRef.componentInstance.requestSent.subscribe(() => {
      this.router.navigate(['booking-calender']);
      console.log("this>>",this)
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getAllBooking() {
    const data = {
      req_to: Number(this.req_to),
      req_to_userType: Number(this.req_to_userType)
    };
    this.rest.getAllRequestBookingList(data).subscribe((res: any) => {
      if (res.success) {
        this.bookings = [];
        this.bookingDetails = res.response;
        res.response.forEach((item: any) => {
          const bookingDate = new Date(item.req_date).toISOString();
          this.bookings.push({
            title: item.message,
            start: bookingDate,
            id: item.req_id,
          });
        });
        this.calendarOption.events = this.bookings;
      }
    })
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

  getJobDetails() {
    this.job_id = '';
    const data = {
      userId: Number(localStorage.getItem('slUserId')),
      userType: Number(localStorage.getItem('slUserType')),
      job_number: this.job_number.trim(),
      job_id: 0,
    };
    this.rest.jobDetails(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response) {
          this.job_startDate = new Date(this.common.convertOnlyDate(res.response.job_startDate))
          this.job_endDate = new Date(this.common.convertOnlyDate(res.response.job_endDate))
          this.dateList = this.common.dateRange(this.job_startDate, this.job_endDate);
        }
      }
    });
  }

  checkIsDateContains(dateArray: any, dateToFind: any): any {
    return dateArray.some((obj: any) => obj.name === dateToFind || obj.value === dateToFind)
  }
  
}
