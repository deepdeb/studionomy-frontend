import { Component } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent {
  index = '' as any;
  job_id = '' as any;
  job_number = '' as any;
  userType = '' as any;
  quotationId = '' as any;
  jobDetails = '';
  jobType = '';
  startDate = '';
  endDate = '';
  inv_id = '';
  products = '';
  emp_id = '' as any;
  external_employee = '';
  custName = '';
  phoneNo = '';
  altPhoneNo = '';
  email = '';
  address = '';
  country = '1' as any;
  state = '' as any;
  city = '';
  pin = '';
  eventLocation = '';
  totalAmount: any = '';
  bookingAmount: any = '';
  dueAmount: any = '';
  stateList: any = [];
  cityList: any = [];
  allInventoryList: any = [];
  allEmployeeList: any = [];
  selectedEquipmentItems: any = [];
  selectedStaffItems: any = [];
  equipmentlimit: number = 10;
  equipmentoffset: number = 0;
  dropdownEquipmentSettings: any = {};
  dropdownStaffsSettings: any = {};
  disabledSubmit: boolean = false;
  todatDate = new Date().toISOString().split('T')[0];
  bookingDate = '';
  equipmemtBookingDetails: any = [];
  equipmemtBookingDetailsFlag: boolean = false;
  equipmentEmployeeDetails: any = [];
  mergedEquipmentEmployeeDetails: any = [];
  itemType: any = '';
  eqEmpEditFlag: boolean = false;
  isLoading: boolean = false;
  subscriptionlimit = 10 as any;
  subscriptionoffset = 0 as any;
  buysubscriptionList: any;

  constructor(
    private common: CommonService,
    private activateRoute: ActivatedRoute,
    private rest: RestService,
    private router: Router,
    private location: Location
  ) {
    this.userType = localStorage.getItem('slUserType');
    this.job_id = this.activateRoute.snapshot.paramMap.get('id');
    this.getStateList();
  }
  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.job_id) {
      this.getJobDetailsById()
    } else {
      this.jobNoGenerate();

      // for converting quote to job
      this.activateRoute.queryParams.subscribe(params => {
          this.quotationId = params['quotation_id'] ? params['quotation_id'] : '',
          this.jobDetails = params['job_details'] ? params['job_details'] : '',
          this.startDate = params['job_startDate'] ? params['job_startDate'] : '',
          this.endDate = params['job_endDate'] ? params['job_endDate'] : '',
          this.products = params['deliverables'] ? params['deliverables'] : '',
          this.custName = params['cust_firstName'] ? params['cust_firstName'] : ''
          this.custName += params['cust_lastName'] ? " " + params['cust_lastName'] : ''
          this.phoneNo = params['cust_phoneNo'] ? params['cust_phoneNo'] : '',
          this.altPhoneNo = params['cust_altPhoneNo'] ? params['cust_altPhoneNo'] : '',
          this.email = params['cust_email'] ? params['cust_email'] : '',
          this.eventLocation = params['event_location'] ? params['event_location'] : '',
          this.totalAmount = params['total_amount'] ? params['total_amount'] : '',
          this.jobType = params['job_type'] ? params['job_type'] : ''
      })
    }

    this.dropdownEquipmentSettings = {
      singleSelection: false,
      idField: 'inv_id',
      textField: 'inv_code',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
    this.dropdownStaffsSettings = {
      singleSelection: false,
      idField: 'emp_id',
      textField: 'empName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };

    // this.getAllBuySubscriptionList();
  }

  jobNoGenerate() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
    };
    this.rest.jobNoGenerate(data).subscribe((res: any) => {
      if (res.success) {
        this.job_number = res.response;
      }
    });
  }

  getStateList() {
    this.rest.getStateList().subscribe((res: any) => {
      if (res.success) {
        this.stateList = res.response;
      }
    });
  }

  getInventoryList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      startDate: this.bookingDate,
      endDate: this.bookingDate,
    };
    this.rest.getInventoryList(data).subscribe((res: any) => {
      if (res.success) {
        this.allInventoryList = [];
        this.allInventoryList = res.response;
      }
    });
  }

  getAllEmployee() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      startDate: this.bookingDate,
      endDate: this.bookingDate,
    };
    this.rest.getEmployeeList(data).subscribe((res: any) => {
      if (res.success) {
        this.allEmployeeList = [];
        this.allEmployeeList = res.response;
      }
    });
  }




  createJob() {

    // if (this.job_id != 0) {
    //   if (this.endDate < this.todatDate) {
    //     this.common.showAlertMessage(
    //       'Opps! Job update time is expired',
    //       this.common.errContent
    //     );
    //     return;
    //   }
    // }

    if (
      this.jobType == '' ||
      this.jobType == null ||
      this.jobType == undefined
    ) {
      this.common.showAlertMessage(
        'Please enter job type',
        this.common.errContent
      );
      return;
    }

    if (
      this.jobDetails == '' ||
      this.jobDetails == null ||
      this.jobDetails == undefined
    ) {
      this.common.showAlertMessage(
        'Please enter job details',
        this.common.errContent
      );
      return;
    }

    if (
      this.startDate == '' ||
      this.startDate == null ||
      this.startDate == undefined
    ) {
      this.common.showAlertMessage(
        'Please choose start date',
        this.common.errContent
      );
      return;
    }

    if (
      this.endDate == '' ||
      this.endDate == null ||
      this.endDate == undefined
    ) {
      this.common.showAlertMessage(
        'Please choose end date',
        this.common.errContent
      );
      return;
    }

    if (this.endDate < this.startDate) {
      this.common.showAlertMessage(
        'End date must be greater than start date',
        this.common.errContent
      );
      return;
    }

    if (this.userType == 0) {
      if (
        this.products == '' ||
        this.products == null ||
        this.products == undefined
      ) {
        this.common.showAlertMessage(
          'Please enter products',
          this.common.errContent
        );
        return;
      }
    }
    if (
      this.custName == '' ||
      this.custName == null ||
      this.custName == undefined
    ) {
      this.common.showAlertMessage(
        'Please enter customer name',
        this.common.errContent
      );
      return;
    }
    if (
      this.phoneNo == '' ||
      this.phoneNo == null ||
      this.phoneNo == undefined
    ) {
      this.common.showAlertMessage(
        'Please enter phone no',
        this.common.errContent
      );
      return;
    }
    // if (
    //   this.phoneNo != null &&
    //   this.phoneNo != '' &&
    //   this.phoneNo != undefined
    // ) {
    //   if (this.common.phoneNumberFormat(this.phoneNo) == false) {
    //     this.common.showAlertMessage(
    //       'Please enter valid phone no',
    //       this.common.errContent
    //     );
    //     return;
    //   }
    // }
    // if (
    //   this.altPhoneNo != null &&
    //   this.altPhoneNo != '' &&
    //   this.altPhoneNo != undefined
    // ) {
    //   if (this.common.phoneNumberFormat(this.altPhoneNo) == false) {
    //     this.common.showAlertMessage(
    //       'Please enter valid alternate phone no',
    //       this.common.errContent
    //     );
    //     return;
    //   }
    // }
    if (this.phoneNo == this.altPhoneNo) {
      this.common.showAlertMessage(
        'Alternate phone no must be different',
        this.common.errContent
      );
      return;
    }

    if (this.email != null && this.email != '' && this.email != undefined) {
      if (this.common.mailFormatCheck(this.email) == false) {
        this.common.showAlertMessage(
          'Please enter valid email',
          this.common.errContent
        );
        return;
      }
    }
    if (
      this.address == '' ||
      this.address == null ||
      this.address == undefined
    ) {
      this.common.showAlertMessage(
        'Please enter address',
        this.common.errContent
      );
      return;
    }
    if (
      this.country == '' ||
      this.country == null ||
      this.country == undefined
    ) {
      this.common.showAlertMessage(
        'Please select country',
        this.common.errContent
      );
      return;
    }
    if (this.state == '' || this.state == null || this.state == undefined) {
      this.common.showAlertMessage(
        'Please select state',
        this.common.errContent
      );
      return;
    }
    if (this.city == '' || this.city == null || this.city == undefined) {
      this.common.showAlertMessage('Please enter city', this.common.errContent);
      return;
    }
    if (
      this.eventLocation == '' ||
      this.eventLocation == null ||
      this.eventLocation == undefined
    ) {
      this.common.showAlertMessage(
        'Please enter event location',
        this.common.errContent
      );
      return;
    }
    if (
      this.totalAmount == '' ||
      this.totalAmount == null ||
      this.totalAmount == undefined ||
      this.totalAmount == 0
    ) {
      this.common.showAlertMessage(
        'Please enter total amount',
        this.common.errContent
      );
      return;
    }
    if (
      this.bookingAmount == '' ||
      this.bookingAmount == null ||
      this.bookingAmount == undefined
    ) {
      this.common.showAlertMessage(
        'Please enter booking amount',
        this.common.errContent
      );
      return;
    }

    let inv_id_array = [] as any;
    let emp_id_array = [] as any;
    for (let i = 0; i < this.equipmemtBookingDetails.length; i++) {
      const bookingDetail = this.equipmemtBookingDetails[i];

      // Aggregating inv_id
      for(let j = 0; j < bookingDetail.equipments.length; j++) {
        let currentInvId = bookingDetail.equipments[j].inv_id;
        if (!inv_id_array.includes(currentInvId)) {
          inv_id_array.push(currentInvId);
        }
      }
      
      // Aggregating emp_id
      for(let k = 0; k < bookingDetail.employee.length; k++) {
        let currentEmpId = bookingDetail.employee[k].emp_id;
        if(!emp_id_array.includes(currentEmpId)) {
          emp_id_array.push(currentEmpId);
        }
      }

      // Calling the invEmployeeBookForJob method
      this.invEmployeeBookForJob(
        bookingDetail.bookingDate,
        bookingDetail.equipments,
        bookingDetail.employee
      );
    }
    this.inv_id = inv_id_array.join(',');
    this.emp_id = emp_id_array.join(',');
    

    // this.invEmployeeBookForJob(
    //   this.equipmemtBookingDetails[this.equipmemtBookingDetails.length - 1]
    //     .bookingDate,
    //   this.equipmemtBookingDetails[this.equipmemtBookingDetails.length - 1]
    //     .equipments,
    //   this.equipmemtBookingDetails[this.equipmemtBookingDetails.length - 1]
    //     .employee
    // );

    const data = {
      quotation_id: this.quotationId,
      job_id: this.job_id,
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      job_number: this.job_number,
      job_details: this.jobDetails,
      job_type: this.jobType,
      job_startDate: this.startDate,
      job_endDate: this.endDate,
      equipments: this.inv_id,
      emp_id: this.emp_id,
      external_employee: this.external_employee,
      products: this.products,
      cust_name: this.custName,
      cust_phoneNo: this.phoneNo,
      cust_altPhoneNo: this.altPhoneNo,
      cust_email: this.email,
      cust_address: this.address,
      country_id: this.country,
      state_id: this.state,
      cust_city: this.city,
      cust_pin: this.pin,
      event_location: this.eventLocation,
      total_amount: this.totalAmount,
      booking_amount: this.bookingAmount,
      due_amount: this.dueAmount
    };
    this.disabledSubmit = true;
    this.isLoading = true;
    this.rest.createJob(data).subscribe((res: any) => {
      if (res.success) {
        this.router.navigate(['/user']);
        this.disabledSubmit = false;
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.jobDetails = '';
        this.jobType = '';
        this.startDate = '';
        this.endDate = '';
        this.inv_id = '';
        this.emp_id = '';
        this.external_employee = '';
        this.products = '';
        this.custName = '';
        this.phoneNo = '';
        this.altPhoneNo = '';
        this.email = '';
        this.address = '';
        this.country = '1';
        this.state = '';
        this.city = '';
        this.pin = '';
        this.eventLocation = '';
        this.totalAmount = '';
        this.bookingAmount = '';
        this.dueAmount = '';
        this.selectedEquipmentItems = [];
        this.selectedStaffItems = [];
        this.bookingDate = '';
      }
    });
  }

  calculateDueAmount() {
    if (this.totalAmount < 0) {
      this.dueAmount = 0;
    } else {
      this.dueAmount = this.totalAmount - this.bookingAmount;
    }
  }

  getEquipmentAndEmployee() {
    if(!this.startDate || !this.endDate) {
      this.common.showAlertMessage('Please select Job Start Date & Job End Date', this.common.errContent)
      this.bookingDate = ''
      return
    }
    this.getInventoryList();
    this.getAllEmployee();
  }

  getJobDetailsById() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      job_id: this.job_id,
    };
    this.rest.jobDetails(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response) {
          this.state = res.response.state_id;
          this.startDate = this.common.convertOnlyDate(
            res.response.job_startDate
          );
          this.endDate = this.common.convertOnlyDate(res.response.job_endDate);
          this.job_number = res.response.job_number;
          this.inv_id = res.response.equipments;
          this.emp_id = res.response.emp_id;
          this.jobDetails = res.response.job_details;
          this.jobType = res.response.job_type;
          this.external_employee = res.response.external_employee;
          this.products = res.response.products;
          this.custName = res.response.cust_name;
          this.phoneNo = res.response.cust_phoneNo;
          this.altPhoneNo = res.response.cust_altPhoneNo;
          this.email = res.response.cust_email;
          this.address = res.response.cust_address;
          this.country = res.response.country_id;
          this.getCityList();
          this.city = res.response.cust_city;
          this.pin = res.response.cust_pin;
          this.eventLocation = res.response.event_location;
          this.totalAmount = res.response.total_amount;
          this.bookingAmount = res.response.booking_amount;
          this.dueAmount = res.response.due_amount;
          this.getEquipEmployeeDetailsById();

          
          // var tempInvId: any = [];
          // if (this.inv_id.includes(',')) {
          //   var tempEquipmentArr = [];
          //   tempEquipmentArr = this.inv_id.split(',');
          //   for (let i = 0; i < tempEquipmentArr.length; i++) {
          //     tempInvId.push(Number(tempEquipmentArr[i]));
          //   }
          // } else {
          //   tempInvId.push(Number(this.inv_id));
          // }
          // this.selectedEquipmentItems = this.allInventoryList.filter(
          //   (item: any) => tempInvId.includes(item.inv_id)
          // );
          //this.inv_id = '';

          // var tempEmpId: any = [];
          // if (this.emp_id.includes(',')) {
          //   var tempEmployeeArr = [];
          //   tempEmployeeArr = this.emp_id.split(',');
          //   for (let i = 0; i < tempEmployeeArr.length; i++) {
          //     tempEmpId.push(Number(tempEmployeeArr[i]));
          //   }
          // } else {
          //   tempEmpId.push(Number(this.emp_id));
          // }
          // this.selectedStaffItems = this.allEmployeeList.filter((item: any) =>
          //   tempEmpId.includes(item.emp_id)
          // );
          //this.emp_id = '';
        }
      }
    });
  }

  onItemSelected() {
    if (this.bookingDate == '' || this.bookingDate == '') {
      this.selectedEquipmentItems = [];
      this.common.showAlertMessage(
        'Please first choose booking date then select equipments',
        this.common.errContent
      );
      return;
    }
  }

  onStaffSelected() {
    if (this.bookingDate == '' || this.bookingDate == '') {
      this.selectedStaffItems = [];
      this.common.showAlertMessage(
        'Please first choose booking date then select staff',
        this.common.errContent
      );
      return;
    }
  }

  onStaffDeselected(empItem: any) {
    const empIndex = this.equipmentEmployeeDetails.findIndex((item: { empName: any; }) => item.empName === empItem.empName)
    this.itemType = "employee";
    if(this.eqEmpEditFlag) {
      this.equipmentTableRemove(empIndex, this.itemType);
    }
  }

  onEquipmentDeselected(invItem: any) {
    const invIndex = this.equipmentEmployeeDetails.findIndex((item: { inv_code: any;}) => item.inv_code === invItem.inv_code)
    this.itemType = "equipment";
    if(this.eqEmpEditFlag) {
      this.equipmentTableRemove(invIndex, this.itemType);
    }
  }

  // equipmentTableEdit(index: any) {
  //   this.index = index;
  //   this.equipmemtBookingDetailsFlag = true;
  //   this.bookingDate = this.equipmemtBookingDetails[index].bookingDate;
  //   this.selectedEquipmentItems = this.equipmemtBookingDetails[index].equipments;
  //   this.selectedStaffItems = this.equipmemtBookingDetails[index].employee;
  // }

  equipmentTableEdit(index: any) {
    console.log('>>>', this.equipmentEmployeeDetails);
    this.index = index;
    this.eqEmpEditFlag = true;
    this.bookingDate = this.equipmentEmployeeDetails[index].booked_from;
    this.selectedEquipmentItems = [{inv_id: Number(this.equipmentEmployeeDetails[index].inv_id), inv_code: this.equipmentEmployeeDetails[index].inv_code}];
    this.selectedStaffItems = [{emp_id: Number(this.equipmentEmployeeDetails[index].emp_id), empName: this.equipmentEmployeeDetails[index].empName}];
    this.getEquipmentAndEmployee();
  }

  equipTableEditNewJob(index: any) {
    this.index = index;
    this.equipmemtBookingDetailsFlag = true;
    this.bookingDate = this.equipmemtBookingDetails[index].bookingDate;
    this.selectedEquipmentItems = this.equipmemtBookingDetails[index].equipments;
    this.selectedStaffItems = this.equipmemtBookingDetails[index].employee;
  }

  equipmentTableRemove(index: any, itemType: any) {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      job_id: this.job_id,
      job_number: this.job_number,
      bookingDate: this.equipmentEmployeeDetails[index].booked_from,
      inv_id: this.equipmentEmployeeDetails[index].inv_id,
      emp_id: this.equipmentEmployeeDetails[index].emp_id,
      itemType: itemType
    }
    this.rest.equipmentTableRemove(data).subscribe((res:any) => {
      if (res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.getEquipmentAndEmployee();
        this.equipmentEmployeeDetails = [];
        this.getJobDetailsById();
      }
    })
    if(!itemType){
    this.equipmentEmployeeDetails.splice(index, 1)
    }
  }

  addEqupEmpDetails() {
    if (
      this.bookingDate == '' ||
      this.bookingDate == null ||
      this.bookingDate == undefined
    ) {
      this.common.showAlertMessage(
        'Please choose booking date',
        this.common.errContent
      );
      return;
    }

    if(this.bookingDate > this.endDate || this.bookingDate < this.startDate) {
      this.common.showAlertMessage('Booking date must be within Job Start Date & Job End Date', this.common.errContent);
      return
    }

    if (
      (this.selectedEquipmentItems == '' ||
      this.selectedEquipmentItems == null ||
      this.selectedEquipmentItems == undefined) &&
      (this.selectedStaffItems == '' ||
      this.selectedStaffItems == null ||
      this.selectedStaffItems == undefined)
    ) {
      this.common.showAlertMessage(
        'Please choose either equipment or employee',
        this.common.errContent
      );
      return;
    }

    if (this.equipmemtBookingDetailsFlag == true) {
      // this.equipmemtBookingDetails.splice(this.index, 1);
      // this.equipmemtBookingDetails.push({
      //   bookingDate: this.bookingDate,
      //   equipments: this.selectedEquipmentItems,
      //   employee: this.selectedStaffItems,
      // });

      this.equipmemtBookingDetails[this.index].bookingDate = this.bookingDate;
      this.equipmemtBookingDetails[this.index].equipments = this.selectedEquipmentItems;
      this.equipmemtBookingDetails[this.index].employee = this.selectedStaffItems;
      
      this.bookingDate = '';
      this.selectedEquipmentItems = [];
      this.selectedStaffItems = [];
      this.equipmemtBookingDetailsFlag = false;
    } else {
      this.equipmemtBookingDetails.push({
        bookingDate: this.bookingDate,
        equipments: this.selectedEquipmentItems,
        employee: this.selectedStaffItems,
      });
      // if(this.eqEmpEditFlag == true) {
      //   this.equipmentEmployeeDetails.splice(this.index,1);
      // }
      this.bookingDate = '';
      this.selectedEquipmentItems = [];
      this.selectedStaffItems = [];
    }

    // this.invEmployeeBookForJob(
    //   this.equipmemtBookingDetails[this.equipmemtBookingDetails.length - 1]
    //     .bookingDate,
    //   this.equipmemtBookingDetails[this.equipmemtBookingDetails.length - 1]
    //     .equipments,
    //   this.equipmemtBookingDetails[this.equipmemtBookingDetails.length - 1]
    //     .employee
    // );

    // this.equipmentEmployeeDetails.push({
    //   booked_from: this.bookingDate,
    //   equipments: this.selectedEquipmentItems,
    //   employee: this.selectedStaffItems,
    // });
    // this.bookingDate = '';
    // this.selectedEquipmentItems = [];
    // this.selectedStaffItems = [];

    // this.invEmployeeBookForJob(
    //   this.equipmentEmployeeDetails[this.equipmentEmployeeDetails.length - 1]
    //     .booked_from,
    //   this.equipmentEmployeeDetails[this.equipmentEmployeeDetails.length - 1]
    //     .equipments,
    //   this.equipmentEmployeeDetails[this.equipmentEmployeeDetails.length - 1]
    //     .employee
    // );

  }

  invEmployeeBookForJob(bookingDate: any, equipments: any, employees: any) {
    var selectEquipments = '';
    var selectEmployee = '';
    // this.inv_id = '';
    // this.emp_id = '';
    for (let item of equipments) {
      selectEquipments +=
        selectEquipments.length > 0 ? ',' + item.inv_id : item.inv_id;
      this.inv_id +=
        this.inv_id.length > 0 ? ',' + item.inv_id : item.inv_id;
    }
    for (let item of employees) {
      selectEmployee +=
        selectEmployee.length > 0 ? ',' + item.emp_id : item.emp_id;
      this.emp_id +=
        this.emp_id.length > 0 ? ',' + item.emp_id : item.emp_id;
    }
    const data = {
      job_id: this.job_id,
      job_number: this.job_number,
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      bookingDate: bookingDate,
      equipments: selectEquipments,
      employees: selectEmployee,
    };
    this.rest.invEmployeeBook(data).subscribe((res: any) => {
      if(res.success){
        this.common.showAlertMessage(res.message[0] + ", " + res.message[1], this.common.succContent);
        this.allInventoryList = [];
        this.allEmployeeList = [];
      }
      else {
        this.equipmemtBookingDetails.pop()
        this.common.showAlertMessage(res.error, this.common.errContent);
        this.allInventoryList = [];
        this.allEmployeeList = [];
      }
    });
  }

  edit(index: any) {}

  remove(index: any) {
    this.index = index;
  }

  getCityList() {
    var stateName = this.getStateNameById(this.state);
    if (stateName) {
      const data = {
        country: 'India',
        state: stateName,
      };
      this.rest.getCityList(data).subscribe((res: any) => {
        if (res.error == false) {
          this.cityList = res.data;
        }
      });
    }
  }

  getStateNameById(id: any) {
    const foundState = this.stateList.find(
      (state: any) => state.state_id == id
    );
    return foundState ? foundState.state_name : null;
  }

  getEquipEmployeeDetailsById() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      job_id: this.job_id,
      job_number: this.job_number
    };
    this.rest.getEquipmentsEmployee(data).subscribe((res: any) => {
      if (res.success) {
        console.log('eq, emp details >>>', res.response)
        this.equipmentEmployeeDetails = []
        this.equipmentEmployeeDetails = res.response;
      // this.mergeEquipEmployeeData()
      }
    })
  }

  mergeEquipEmployeeData() {
    if (!Array.isArray(this.equipmentEmployeeDetails)) {
      console.error('Invalid data: equipmentEmployeeDetails is not an array');
      return;
    }
    const bookingMap = new Map();

    this.equipmentEmployeeDetails.forEach(item => {
      let { booked_from } = item;

      if (!bookingMap.has(booked_from)) {
        bookingMap.set(booked_from, {
          equipmentList: [],
          employeeList: []
        });
      }

      const bookingEntry = bookingMap.get(booked_from);
      if (item.inv_id && item.inv_code) {
        bookingEntry.equipmentList.push(item);
      } else if (item.emp_id && item.empName) {
        bookingEntry.employeeList.push(item);
      }
    });

    bookingMap.forEach((entry, booked_from) => {
      const { equipmentList, employeeList } = entry;

      if (employeeList.length === 0) {
        employeeList.push({ emp_id: null, empName: null });
      }

      if (equipmentList.length === 0) {
        equipmentList.push({ inv_id: null, inv_code: null });
      }

      equipmentList.forEach((equipment: { inv_code: any; inv_id: any }) => {
        employeeList.forEach((employee: { empName: any; emp_id: any }) => {
          const mergedEntry = {
            booked_from,
            inv_code: equipment.inv_code,
            empName: employee.empName,
            inv_id: equipment.inv_id,
            emp_id: employee.emp_id
          };
          this.mergedEquipmentEmployeeDetails.push(mergedEntry);
        });
        //console.log(this.mergedEquipmentEmployeeDetails)
      });
    });
  }

  showWarning() {
    if(this.endDate < this.startDate) {
      this.endDate = ''
      this.common.showAlertMessage(
        'End date must be greater than start date',
        this.common.errContent
      );
      return
    }
  }

  getAllBuySubscriptionList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      limit: this.subscriptionlimit,
      offset: this.subscriptionoffset
    };
    this.rest.getAllBuySubscriptionList(data).subscribe((res: any) => {
      if (res.success) {
        this.buysubscriptionList = res.response;
        if(this.buysubscriptionList.length == 0 || (this.buysubscriptionList[0].no_of_jobs - this.buysubscriptionList[0].completejob) == 0 || this.buysubscriptionList[0].end_date < this.todatDate) {
          this.common.showAlertMessage('Buy subscription to add jobs', this.common.errContent);
          this.router.navigate(['subscription']);
          return
        }
      }
    })
  }

  dateFormat(date: any) {
    var myDate = new Date(date);
    var finalDate = myDate.toISOString().split('T')[0];
    var tempDate = myDate.toISOString().split('T')[1];
    const [year, month, day] = finalDate.split('-');
    const result = [year, month, day].join('-');
    return result;
  }
}

