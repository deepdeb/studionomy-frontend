import { Component, ViewChild } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequestForBookingComponent } from '../request-for-booking/request-for-booking.component';
@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent {
  limit: number = 10;
  offset: number = 0;
  userType = "" as any;
  userList: any = [];
  country = "1" as any;
  state = "" as any;
  city = "";
  skill = "" as any;
  searchErr = "";
  contactPersonName = "";
  id = "";
  date = "" as string;
  equipmentCategory = "" as any;
  company = "" as any;
  stateList = [] as any;
  cityList = [] as any;
  equipmentCategoryList = [] as any;
  brandList = [] as any;
  searchData = [] as any;
  myNetworkList = [] as any;
  todayDate = new Date();
  search_start_date = "" as any;
  search_end_date = "" as any;
  registerType = "" as any;
  search_name = "" as any;
  jobList: any = [];
  requestList: any = [];
  amountToPay = '' as string
  charges: string = ''
  freelancer_eo_name: string = ''
  payment_to: string = ''
  payment_to_userType: string = ''
  payment_from: string = ''
  payment_from_userType: string = ''
  req_id: any;
  job_id: any;
  datesToCheck: any = [];
  job_number = '';
  isLoading: boolean = false;
  job_startDate: any;
  job_details: any;
  event_location: any;
  job_endDate: any;
  req_details = {} as any;
  due_amount: any = ''
  total_paid_amount: any = ''

  @ViewChild('paymentRequest') paymentRequestModal: any;

  constructor(private dialog: MatDialog, private router: Router, private rest: RestService, private common: CommonService, private route: ActivatedRoute) {
    this.userType = localStorage.getItem('slUserType');
    this.date = new Date().toLocaleDateString('en-CA')
  }

  ngOnInit() {
    this.getMyNetworkList();
    this.getStateList();
    this.getFreelancerRequest();

    this.route.queryParams.subscribe(params => {
      this.job_number = params['job_number'],
        this.job_startDate = params['job_startDate'],
        this.job_endDate = params['job_endDate'],
        this.job_details = params['job_details'],
        this.event_location = params['event_location']
    })
  }

  searchForNetwork(type: any) {
    this.isLoading = true;
    const data = {
      limit: this.limit,
      offset: this.offset,
      country: Number(this.country),
      state: this.state ? Number(this.state) : null,
      city: this.city,
      skill: this.skill,
      equipmentCategory: this.equipmentCategory,
      company: this.company,
      name: this.contactPersonName,
      id: this.id,
      date: this.date,
      userType: Number(type)
    };
    this.rest.searchForNetwork(data).subscribe((res: any) => {
      if (res.success) {
        this.isLoading = false;
        this.searchData = [];
        this.searchData = res.response;

        if (this.date) {
          var allSevenDates = this.getAllSevenDates(new Date(this.date));

          var networkUserIds = []

          for (let i = 0; i <= res.response.length - 1; i++) {
            networkUserIds.push(res.response[i].userId);
          }

          this.getBookingStatusByDates(allSevenDates, networkUserIds)
        }
      }
    })
  }

  getAllSevenDates(date: Date) {
    const allSevenDates: any = [];

    for (let i = -3; i <= 3; i++) {
      const before = new Date(date);
      before.setDate(date.getDate() + (i));
      allSevenDates.push(before.toLocaleDateString('en-CA'));
    }

    return allSevenDates
  }

  getBookingStatusByDates(datesToCheck: any, networkUserIds: any) {
    const data = {
      datesToCheck: datesToCheck,
      networkUserIds: networkUserIds
    }
    this.rest.getBookingStatusByDates(data).subscribe((res: any) => {
      let allBookingStatus = res.response

      this.searchData.forEach((data: any) => {
        if(allBookingStatus[data.userId]) {
          data.bookingStatus = allBookingStatus[data.userId]
        }
      });
    });
  }

  getClassForDate(date: any, statuses: any) {
    if (statuses) {
      for (let status of statuses) {
        if (status.req_date === date && status.req_status === 'accepted') {
          return 'purple_date';
        }
      }
    }
    return 'green_date';
  }
  addToMyNetwork(id: any) {
    const data = {
      userId: Number(localStorage.getItem('slUserId')),
      userType: Number(localStorage.getItem('slUserType')),
      myNetworks: id.toString()
    };
    this.rest.addToMyNetwork(data).subscribe((res: any) => {
      if (res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.getMyNetworkList();
      }
    })
  }

  clearForm() {
    this.country = "1" as any;
    this.state = "" as any;
    this.city = "";
    this.skill = "";
    this.contactPersonName = "";
    this.id = "";
  }
  getStateList() {
    this.rest.getStateList().subscribe((res: any) => {
      if (res.success) {
        this.stateList = res.response;
      }
    })
  }
  getMyNetworkList() {
    const data = {
      userId: Number(localStorage.getItem('slUserId')),
      userType: Number(localStorage.getItem('slUserType')),
    };
    this.rest.getMyNetworkList(data).subscribe((res: any) => {
      if (res.success) {
        this.myNetworkList = [];
        this.myNetworkList = res.response;
      }
    })
  }
  getAllEquipmentCategory() {
    this.rest.getAllEquipmentCategory().subscribe((res: any) => {
      if (res.success) {
        this.equipmentCategoryList = [];
        this.equipmentCategoryList = res.response;
      }
    })
  }
  getAllBrandList() {
    this.rest.getAllBrand().subscribe((res: any) => {
      if (res.success) {
        this.brandList = [];
        this.brandList = res.response;
      }
    })
  }
  searchTab(type: any) {
    this.searchData = [];
    this.clearForm();
    this.date = this.job_startDate ? this.job_startDate : this.date;
    if (type == 2) {
      this.getAllEquipmentCategory();
      this.getAllBrandList();
    }
  }
  goToCalender(userId: any, name: any, mobile: any, userType: any) {
    let queryParams = {
      requestTo: userId,
      requestToName: name,
      mobile: mobile,
      req_to_userType: userType,
      job_number: this.job_number
    };
    if (!queryParams.job_number) {
      this.common.showAlertMessage("Booking FL/EO only possible from calendar by clicking on job", this.common.errContent)
      return
    }
    // this.router.navigate(['public-calender'], { queryParams: queryParams });
    this.openModal(userId, name, mobile, userType)
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

  get_register_type() {
    const data = {
      userType: this.userType,
      limit: 100,
      offset: 0,
    };

    this.rest.searchUser(data).subscribe((res: any) => {
      this.userList = [];
      if (res.success) {
        this.userList = res.response;
      }
    })
  }

  getFreelancerRequest() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
    };
    this.requestList = [];
    this.rest.getAllFreelancerRequest(data).subscribe((res: any) => {
      if (res.success) {
        this.requestList = res.response;
      }
    })
  }

  dateFormat(date: any) {
    var myDate = new Date(date);
    var finalDate = myDate.toISOString().split("T")[0]
    const [year, month, day] = finalDate.split('-');
    const result = [year, month, day].join('-');
    return result;
  }

  newDate(date: any) {
    var myDate = new Date(date);
    return myDate;
  }

  searchJobs() {

    if (this.search_start_date == "") {
      this.common.showAlertMessage("Please select from date", this.common.errContent);
      return;
    }

    if (this.search_end_date == "") {
      this.common.showAlertMessage("Please select to date", this.common.errContent);
      return;
    }
    if (this.registerType == "") {
      this.common.showAlertMessage("Please select user type", this.common.errContent);
      return;
    }

    if (this.search_name == "") {
      this.common.showAlertMessage("Please select name", this.common.errContent);
      return;
    }

    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      search_start_date: this.search_start_date ? this.search_start_date : null,
      search_end_date: this.search_end_date ? this.search_end_date : null,
      registerType: this.registerType ? this.registerType : null,
      search_name: this.search_name ? this.search_name : null,
      limit: 100,
      offset: 0
    };

    this.rest.searchUser(data).subscribe((res: any) => {
      this.userList = [];
      if (res.success) {
        this.userList = res.response;
      }
    })
  }

  openModal(userId: any, name: any, mobile: any, userType: any): void {
    this.req_details = { "req_to": userId, "req_to_userType": userType, "req_to_name": name, "req_date": this.dateFormatFullYearFromHalfYear(this.job_startDate), "job_number": this.job_number, "req_to_mobile": mobile };

    // console.log('341>>>>', this.req_details)

    const dialogRef = this.dialog.open(RequestForBookingComponent, {
      width: '700px',
      data: {
        content: this.req_details
      }
    });
    dialogRef.componentInstance.requestSent.subscribe(() => {
      this.router.navigate(['booking-calender']);
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openPaymentModal(item: any) {
    // console.log('item>>>', item)
    this.req_id = item.req_id
    this.job_id = item.job_id
    this.job_number = item.job_number
    this.freelancer_eo_name = item.name
    this.job_details = item.job_details
    this.charges = item.payment
    this.event_location = item.event_location
    this.payment_to = item.req_to
    this.payment_to_userType = item.req_to_userType
    this.payment_from = item.req_from
    this.payment_from_userType = item.req_from_userType
    this.due_amount = item.due_amount
    this.total_paid_amount = item.total_paid_amount

    const dialogRef: MatDialogRef<any> = this.dialog.open(this.paymentRequestModal, {
      width: '550px',
    });
    dialogRef.afterClosed().subscribe({
    });
  }

  closeModal() {
    this.dialog.closeAll();
    this.amountToPay = ''
  }

  submitPayment() {
    if (Number(this.amountToPay) > Number(this.due_amount) || Number(this.amountToPay) > (Number(this.charges) - Number(this.total_paid_amount))) {
      this.common.showAlertMessage('Payment amount cannot be more than due amount', this.common.errContent)
      return
    }
    const data = {
      req_id: this.req_id,
      job_id: this.job_id,
      job_number: this.job_number,
      payment_to: this.payment_to,
      payment_to_userType: this.payment_to_userType,
      payment_from: this.payment_from,
      payment_from_userType: this.payment_from_userType,
      payment_amount: this.amountToPay
    }
    this.rest.submitPayment(data).subscribe((res: any) => {
      if (res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.closeModal()
        this.amountToPay = ''
        this.getFreelancerRequest()
      }
    })
  }

  dateFormatFullYearFromHalfYear(date: any) {
    const yearPart = date.split('-')[0]
    const monthPart = date.split('-')[1]
    const datePart = date.split('-')[2]
    
    let formattedDate = `20${yearPart}-${monthPart}-${datePart}`
    return formattedDate
  }

}
