import { Component, Inject, Output, EventEmitter } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-request-for-booking',
  templateUrl: './request-for-booking.component.html',
  styleUrls: ['./request-for-booking.component.css'],
})
export class RequestForBookingComponent {
  brandList = [] as any;
  selectedSkillItems: any = [];
  selectedEquipmentItems: any = [];
  selectedDates: any = [];
  message = '';
  req_id = '' as any;
  name = '' as any;
  req_to = '' as any;
  req_to_userType = '' as any;
  req_date = '';
  job_id = '' as any;
  job_number = '';
  event_location = '';
  skillList = this.common.skillList;
  equipmentList = [] as any;
  dateList: any = [];
  dropdownSkillSettings: any = {};
  dropdownEquipmentSettings: any = {};
  dropdownDateSettings: any = {};
  payment: any;
  @Output() requestSent: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateReqBookSent: EventEmitter<void> = new EventEmitter<void>();
  job_description: any;
  studioName = '';
  studioMobile: any;
  address: any;
  req_to_mobile: any;

  todatDate = new Date().toISOString().split('T')[0];
  endDate = ''
  startDate = ''
  bookingDate = ''

  equipmentBookingDetails = [] as any

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<RequestForBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rest: RestService,
    private common: CommonService
  ) {
    this.job_number = this.data.content.job_number;
    this.job_number ? this.getJobDetails() : '';
    this.req_to = this.data.content.req_to;
    this.job_id = this.data.content.job_id;
    if(this.job_number && this.req_to && this.job_id) {
      this.getSelectedDatesForFLBook();
    }
  }

  ngOnInit() {
    this.selectedSkillItems = [];
    this.name = this.data.content.freelancerName ? this.data.content.freelancerName : this.data.content.req_to_name;
    this.req_to_userType = Number(this.data.content.req_to_userType);
    if(this.req_to_userType == 2) {
      this.getEquipmentListForBook();
    }
    this.req_to_mobile = this.data.content.req_to_mobile;
    this.payment = this.data.content.payment;
    this.req_date = this.data.content.req_date;
    this.selectedSkillItems = this.data.content.skills
      ? this.data.content.skills.split(',').map((skill: any) => ({name: skill.trim(), value: skill.trim()}))
      : this.data.content.skills
    this.message = this.data.content.message;
    this.req_id = this.data.content.req_id;
    this.getAllBrandList();
    this.dropdownSkillSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
    this.dropdownEquipmentSettings = {
      singleSelection: false,
      idField: 'inv_id',
      textField: 'inv_code',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    }
    this.dropdownDateSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
  }
  onClose(): void {
    this.dialogRef.close();
  }

  getAllBrandList() {
    this.rest.getAllBrand().subscribe((res: any) => {
      if (res.success) {
        this.brandList = [];
        this.brandList = res.response;
      }
    });
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
          this.job_description = res.response.job_details;
          this.event_location = res.response.event_location;
          let startDate = new Date(this.common.convertOnlyDate(res.response.job_startDate));
          let endDate = new Date(this.common.convertOnlyDate(res.response.job_endDate));
          this.startDate = this.common.convertOnlyDate(res.response.job_startDate)
          this.endDate = this.common.convertOnlyDate(res.response.job_endDate)
          console.log('start date>>>', this.startDate)
          console.log('end date>>>>', this.endDate)
          this.dateList = this.common.dateRange(startDate, endDate);
          this.job_id = res.response.job_id;
        }
      }
    });
  }

  checkIsDateContains(dateArray: any, dateToFind: any): any {
    return dateArray.some((obj: any) => obj.name === dateToFind || obj.value === dateToFind)
  }
 
  sendRequest() {
    if(this.req_to_userType == 1) {
      this.sendRequestForFL();
    } else if (this.req_to_userType == 2) {
      this.sendRequestForEO();
    }
  }

  
  sendRequestForFL() {
    if (
      this.job_number == '' ||
      this.job_number == null ||
      this.job_number == undefined
    ) {
      this.common.showAlertMessage(
        'Please enter job number',
        this.common.errContent
      );
      return;
    }
    if (
      this.job_number == '' ||
      this.job_number == null ||
      this.job_number == undefined
    ) {
      this.common.showAlertMessage(
        'Please enter job number',
        this.common.errContent
      );
      return;
    }
    if (!this.selectedSkillItems) {
      this.common.showAlertMessage(
        'Please select skill',
        this.common.errContent
      );
      return;
    }

    if (this.selectedSkillItems.length > 1) {
      var allSkills = this.selectedSkillItems.map((item: any) => item.value);
      allSkills = allSkills.join(',');
    } else {
      allSkills = this.selectedSkillItems[0].value;
    }

    if (this.selectedSkillItems.length == 0) {
      this.common.showAlertMessage(
        'Please select skill',
        this.common.errContent
      );
      return;
  }

  const datesToSend = [];
  for(let i = 0; i< this.selectedDates.length; i++ ){
    datesToSend.push( `20${this.selectedDates[i].value.substring(6)}-${this.selectedDates[i].value.substring(3,5)}-${this.selectedDates[i].value.substring(0,2)}`);
  }
    const data = {
      req_id: Number(this.req_id),
      job_id: Number(this.job_id),
      job_number: this.job_number,
      event_location: this.event_location,
      skills: allSkills,
      payment: this.payment || 0.0,
      message: this.message,
      req_from: Number(localStorage.getItem('slUserId')),
      req_from_userType: Number(localStorage.getItem('slUserType')),
      req_to: Number(this.req_to),
      req_to_userType: Number(this.req_to_userType),
      selectedDates: datesToSend.length > 0 ? datesToSend : [this.req_date]
    };
    this.rest.sendRequestForFL(data).subscribe((res: any) => {
      if (res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.requestSent.emit();
        this.updateReqBookSent.emit();
        this.getUserDetails(data)
        this.onClose();
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    });
  }

  sendRequestForEO() {
    if(!this.job_number) {
      this.common.showAlertMessage('Please enter job number', this.common.errContent);
      return
    }
    if(!this.event_location) {
      this.common.showAlertMessage('Please enter event location', this.common.errContent);
      return
    }
    if(this.equipmentBookingDetails.length == 0) {
      this.common.showAlertMessage('Please add equipment', this.common.errContent);
      return
    }

    const data = {
      req_id: Number(this.req_id),
      job_id: Number(this.job_id),
      job_number: this.job_number,
      event_location: this.event_location,
      equipment_booking_details: this.equipmentBookingDetails,
      payment: this.payment || 0.0,
      message: this.message,
      req_from: Number(localStorage.getItem('slUserId')),
      req_from_userType: Number(localStorage.getItem('slUserType')),
      req_to: Number(this.req_to),
      req_to_userType: Number(this.req_to_userType)
    }
    this.rest.sendRequestForEO(data).subscribe((res: any) => {
      if (res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.requestSent.emit();
        this.updateReqBookSent.emit();
        // this.getUserDetails(data)
        this.onClose();
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }

  onStaffDeselected(item: any) {
    const index = this.selectedSkillItems.findIndex(
      (selectedItem: any) => selectedItem.value === item.value
    );
    if (index != -1) {
      this.selectedSkillItems.splice(index, 1);
    }
  }

  dateFormat(date: any) {
    let newdate = new Date(date);
    let day = newdate.getDate().toString().padStart(2, '0');
    let month = (newdate.getMonth() + 1).toString().padStart(2, '0');
    let year = newdate.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  handleKeyPress(event: any): void {
    if (
      (event.which < 48 || event.which > 57) &&
      event.which !== 8 &&
      event.which !== 9 &&
      event.which !== 46
    ) {
      event.preventDefault();
      return;
    }
  }

  getUserDetails(data: any) {
    const sendUserdata = {
      userId: data.req_from,
      userType: data.req_from_userType
    }
    this.rest.getUserDetials(sendUserdata).subscribe((res: any) => {
      if(res.success) {
        this.studioName = res.response[0].orgName;
        this.studioMobile = res.response[0].mobile;
        this.address = res.response[0].address + ', ' + res.response[0].location;
        this.whatsappReqBooking(data)
      }
    })
  }

  whatsappReqBooking(data : any) {
    let text = encodeURIComponent(`*Request from: ${this.studioName} Phone no: ${this.studioMobile}, Address: ${this.address}`);
    text += '%0A' + encodeURIComponent(`*Skill required: ${data.skills}`);
    data.message ? text += '%0A' + encodeURIComponent(`*Message: ${data.message}`) : '';
    text += '%0A' + encodeURIComponent(`*Booking for: ${data.selectedDates}`);
    text += '%0A' + encodeURIComponent(`*Event location: ${data.event_location}`);
    text += '%0A'
    text += '%0A' + encodeURIComponent('Courtest - @Studionomy.com');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${this.req_to_mobile ? this.req_to_mobile : ''}&text=${text}`;
    window.open(whatsappUrl, '_blank');
  }

  getSelectedDatesForFLBook() {
    const data = {
      job_id: this.job_id,
      job_number: this.job_number,
      req_to: this.req_to
    }
    this.rest.getSelectedDatesForFLBook(data).subscribe((res: any) => {
      if(res.success) {
        for(let i = 0; i< res.response.length; i++) {
          this.selectedDates.push({"name": res.response[i].req_date, "value": res.response[i].req_date})
        }
      }
    })
  }

  getEquipmentListForBook() {
    this.equipmentList = [];
    const data = {
      req_to : this.req_to,
      req_to_userType: this.req_to_userType
    }
    this.rest.getEquipmentListForBook(data).subscribe((res: any) => {
      if(res.success) {
        this.equipmentList = res.response
      } 
    })
  }

  addEquipDetails() {
    if(this.bookingDate < this.startDate || this.bookingDate > this.endDate) {
      this.common.showAlertMessage("Selected date must be within job start date & job end date", this.common.errContent);
      return
    }
    
    this.equipmentBookingDetails.push({booked_from: this.bookingDate, equipments: this.selectedEquipmentItems.map((eq: any) => eq.inv_code).join(','), equipments_id: this.selectedEquipmentItems.map((eq: any) => eq.inv_id).join(',')})
    this.selectedEquipmentItems = []
  }
  
  equipmentTableEdit(index: any) {

  }

  equipmentTableRemove(index: any, item: any) {

  }

  equipTableEditNewJob(index: any) {

  }

  showSelectedEquipments() {

  }

}
