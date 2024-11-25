import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-get-quote',
  templateUrl: './get-quote.component.html',
  styleUrls: ['./get-quote.component.css']
})

export class GetQuoteComponent {
  index = "" as any;
  userType = "" as any;
  studioName = "" as any;
  address = "" as any;
  quotation_number = "" as any;
  jobDetails = "" as any;
  firstName = "" as any;
  lastName = "" as any;
  job_startdate = "" as any;
  job_enddate = "" as any;
  eventLocation = "" as any;
  disabledSubmit: boolean = false;
  email = "" as any;
  phoneno = "" as any;
  altphoneno = "" as any;
  total_amt = "" as any;
  projectDesc = "" as any;
  customField: boolean = false;
  bookingDate = "" as any;
  allInventoryList: any = [];
  allEmployeeList: any = [];
  selectedEquipmentItems: any = [];
  specializations: any;
  crews: any;
  dropdownEquipmentSettings: any = {};
  dropdownStaffsSettings: any = {};
  selectedStaffItems: any = [];
  equipmemtBookingDetailsFlag: boolean = false;
  equipmemtBookingDetails: any = [];
  inv_id = "";
  job_number = "" as any;
  emp_id = "" as any;
  customName = "" as any;
  customValue = "" as any;
  deliverables = "" as any;
  termscondition = "" as any;
  quotethemeImg = "";
  imagePath = this.rest.imagePath;
  isLoading: boolean = false;

  constructor(private common: CommonService, private router: Router, private rest: RestService) {
    this.userType = localStorage.getItem('slUserType');
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.dropdownEquipmentSettings = {
      singleSelection: false,
      idField: 'inv_id',
      textField: 'inv_code',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.dropdownStaffsSettings = {
      singleSelection: false,
      idField: 'emp_id',
      textField: 'empName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    }
    this.quotationNoGenerate();
    this.getUserDetails();
  }

  AddCustoField() {
    this.customField = true;
  }


  removeCustomFields() {
    this.customField = false;
  }

  onItemSelected() {
    if (this.bookingDate == "" || this.bookingDate == "") {
      this.selectedEquipmentItems = [];
      this.common.showAlertMessage("Please first choose booking date then select equipments", this.common.errContent);
      return;
    }
  }

  onStaffSelected() {
    if (this.bookingDate == "" || this.bookingDate == "") {
      this.selectedStaffItems = [];
      this.common.showAlertMessage("Please first choose booking date then select crew", this.common.errContent);
      return;
    }
  }


  onStaffDeselected(item: any) {
    const index = this.selectedStaffItems.findIndex((selectedItem: any) => selectedItem.id === item.emp_id);
    if (index != -1) {
      this.selectedStaffItems.splice(index, 1);
    }
  }

  getEquipmentAndEmployee() {
    console.log(this.bookingDate);
    this.getInventoryList();
    this.getAllEmployee();
  }

  getInventoryList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      startDate: this.bookingDate,
      endDate: this.bookingDate
    };
    this.rest.getInventoryList(data).subscribe((res: any) => {
      if (res.success) {
        this.allInventoryList = [];
        this.allInventoryList = res.response;
      }
    })
  }

  getAllEmployee() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      startDate: this.bookingDate,
      endDate: this.bookingDate
    };
    console.log(data);
    this.rest.getEmployeeList(data).subscribe((res: any) => {
      if (res.success) {
        this.allEmployeeList = [];
        this.allEmployeeList = res.response;
      }
    })
  }

  addEqupEmpDetails() {
    if (this.bookingDate == "" || this.bookingDate == null || this.bookingDate == undefined) {
      this.common.showAlertMessage("Please fill booking date", this.common.errContent);
      return;
    }

    if (this.bookingDate < this.job_startdate || this.bookingDate > this.job_enddate) {
      this.common.showAlertMessage("Booking date must be in between Job start date & job end date", this.common.errContent);
      return;
    }

    // if (this.equipmemtBookingDetailsFlag == true) {
    //   this.equipmemtBookingDetails.splice(this.index, 1);
    //   this.equipmemtBookingDetails.push({ "bookingDate": this.bookingDate, "equipments": this.selectedEquipmentItems, "employee": this.selectedStaffItems });
    //   this.bookingDate = "";
    //   this.selectedEquipmentItems = [];
    //   this.selectedStaffItems = [];
    //   this.equipmemtBookingDetailsFlag = false;
    // } else {
    //   this.equipmemtBookingDetails.push({ "bookingDate": this.bookingDate, "equipments": this.selectedEquipmentItems, "employee": this.selectedStaffItems });
    //   this.bookingDate = "";
    //   this.selectedEquipmentItems = [];
    //   this.selectedStaffItems = [];
    // }
    // this.invEmployeeBookForJob(this.equipmemtBookingDetails[this.equipmemtBookingDetails.length - 1].bookingDate, this.equipmemtBookingDetails[this.equipmemtBookingDetails.length - 1].equipments, this.equipmemtBookingDetails[this.equipmemtBookingDetails.length - 1].employee);

    if (this.equipmemtBookingDetailsFlag == true) {
      this.equipmemtBookingDetails[this.index].bookingDate = this.bookingDate;
      this.equipmemtBookingDetails[this.index].specializations = this.specializations;
      this.equipmemtBookingDetails[this.index].crews = this.crews;
      this.bookingDate = "";
      this.specializations = "";
      this.crews = "";
      this.equipmemtBookingDetailsFlag = false;
    } else {
      this.equipmemtBookingDetails.push({ "bookingDate": this.bookingDate, "specializations": this.specializations, "crews": this.crews });
      this.bookingDate = "";
      this.specializations = "";
      this.crews = "";
    }
  }

  // invEmployeeBookForJob(bookingDate: any, equipments: any, employees: any) {
  //   var selectEquipments = "";
  //   var selectEmployee = "";
  //   for (let item of equipments) {
  //     selectEquipments += selectEquipments.length > 0 ? ',' + item.inv_id : item.inv_id;
  //     this.inv_id += this.inv_id.length > 0 ? ',' + selectEquipments : selectEquipments;
  //     console.log("inv_id>>>>>>>", this.inv_id);
  //   }
  //   for (let item of employees) {
  //     selectEmployee += selectEmployee.length > 0 ? ',' + item.emp_id : item.emp_id;
  //     this.emp_id += this.emp_id.length > 0 ? ',' + selectEmployee : selectEmployee;
  //     console.log("emp_id>>>>>>>", this.emp_id);
  //   }
  //   const data = {
  //     job_number: this.job_number,
  //     userId: localStorage.getItem('slUserId'),
  //     userType: localStorage.getItem('slUserType'),
  //     bookingDate: bookingDate,
  //     equipments: selectEquipments,
  //     employees: selectEmployee
  //   };
  //   this.rest.invEmployeeBook(data).subscribe((res: any) => {
  //     this.allInventoryList = [];
  //     this.allEmployeeList = [];
  //   });
  // }

  // equipmentTableEdit(index: any) {
  //   this.index = index;
  //   this.equipmemtBookingDetailsFlag = true;
  //   this.bookingDate = this.equipmemtBookingDetails[index].bookingDate;
  //   this.selectedEquipmentItems = this.equipmemtBookingDetails[index].equipments;
  //   this.selectedStaffItems = this.equipmemtBookingDetails[index].employee;
  // }

  equipmentTableEdit(index: any) {
    this.index = index;
    this.equipmemtBookingDetailsFlag = true;
    this.bookingDate = this.equipmemtBookingDetails[index].bookingDate;
    this.specializations = this.equipmemtBookingDetails[index].specializations;
    this.crews = this.equipmemtBookingDetails[index].crews;
  }

  equipmentTableRemove(index: any) {
    this.equipmemtBookingDetails.splice(index, 1);
  }

  quotationGenerate() {
    if (this.studioName == "" || this.studioName == null || this.studioName == undefined) {
      this.common.showAlertMessage("Please enter studio name", this.common.errContent);
      return;
    }

    if (this.address == "" || this.address == null || this.address == undefined) {
      this.common.showAlertMessage("Please enter address", this.common.errContent);
      return;
    }

    if (this.jobDetails == "" || this.jobDetails == null || this.jobDetails == undefined) {
      this.common.showAlertMessage("Please enter job details", this.common.errContent);
      return;
    }

    if (this.firstName == "" || this.firstName == null || this.firstName == undefined) {
      this.common.showAlertMessage("Please enter firstname", this.common.errContent);
      return;
    }

    if (this.lastName == "" || this.lastName == null || this.lastName == undefined) {
      this.common.showAlertMessage("Please enter lastname", this.common.errContent);
      return;
    }

    if (this.job_startdate == "" || this.job_startdate == null || this.job_startdate == undefined) {
      this.common.showAlertMessage("Please enter job start date", this.common.errContent);
      return;
    }
    if (this.job_enddate == "" || this.job_enddate == null || this.job_enddate == undefined) {
      this.common.showAlertMessage("Please enter job end date", this.common.errContent);
      return;
    }

    if (this.eventLocation == "" || this.eventLocation == null || this.eventLocation == undefined) {
      this.common.showAlertMessage("Please enter event location", this.common.errContent);
      return;
    }
    if (this.email == "" || this.email == null || this.email == undefined) {
      this.common.showAlertMessage("Please enter email", this.common.errContent);
      return;
    }

    if (this.phoneno != null && this.phoneno != "" && this.phoneno != undefined) {
      if (this.common.phoneNumberFormat(this.phoneno) == false) {
        this.common.showAlertMessage("Please enter valid phone no", this.common.errContent);
        return;
      }
    }
    if (this.altphoneno != null && this.altphoneno != "" && this.altphoneno != undefined) {
      if (this.common.phoneNumberFormat(this.altphoneno) == false) {
        this.common.showAlertMessage("Please enter valid alternate phone no", this.common.errContent);
        return;
      }
    }
    if (this.phoneno == this.altphoneno) {
      this.common.showAlertMessage("Alternate phone no must be different", this.common.errContent);
      return;
    }

    if (this.total_amt == "" || this.total_amt == null || this.total_amt == undefined) {
      this.common.showAlertMessage("Please enter total amount", this.common.errContent);
      return;
    }

    if (this.projectDesc == "" || this.projectDesc == null || this.projectDesc == undefined) {
      this.common.showAlertMessage("Please enter project description", this.common.errContent);
      return;
    }

    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      quotation_number: this.quotation_number,
      studioName: this.studioName,
      job_details: this.jobDetails,
      job_startDate: this.job_startdate,
      job_endDate: this.job_enddate,
      bookingDates: this.equipmemtBookingDetails.map((item: { bookingDate: any; }) => item.bookingDate),
      specializations: this.equipmemtBookingDetails.map((item: { specializations: any; }) => item.specializations),
      crews: this.equipmemtBookingDetails.map((item: { crews: any; }) => item.crews),
      address: this.address,
      cust_firstName: this.firstName,
      cust_lastName: this.lastName,
      cust_phoneNo: this.phoneno,
      cust_altPhoneNo: this.altphoneno,
      cust_email: this.email,
      eventLocation: this.eventLocation,
      total_amt: this.total_amt,
      projectDesc: this.projectDesc,
      quotethemeImg: this.quotethemeImg ? this.quotethemeImg : null,
      customName: this.customName,
      customValue: this.customValue,
      deliverables: this.deliverables,
      termscondition: this.termscondition
    };
    this.disabledSubmit = true;
    this.rest.createQuote(data).subscribe((res: any) => {
      if (res.success && res.response.insertId) {
        this.disabledSubmit = false;
        this.common.showAlertMessage(res.message, this.common.succContent);
        // this.router.navigate(['/user']);
        this.jobDetails = "";
        this.job_startdate = "";
        this.job_enddate = "";
        this.firstName = "";
        this.lastName = "";
        this.phoneno = "";
        this.altphoneno = "";
        this.email = "";
        this.eventLocation = "";
        this.total_amt = "";
        this.projectDesc = "";
        this.quotethemeImg = "";
        this.customName = "";
        this.customValue = "";
        this.deliverables = "";
        this.termscondition = "";
        //     // this.inv_id = "";
        //     // this.emp_id = "";
        //     // this.external_employee = "";
        //     // this.products = "";
        //     // this.custName = "";
        //     // this.phoneNo = "";
        //     // this.altPhoneNo = "";
        //     // this.email = "";
        //     // this.address = "";
        //     // this.country = "1";
        //     // this.state = "";
        //     // this.city = "";
        //     // this.pin = "";
        //     // this.eventLocation = "";
        //     // this.totalAmount = "";
        //     // this.bookingAmount = "";
        //     // this.dueAmount = "";
        //     // this.selectedEquipmentItems = [];
        this.generateQuotationPdf(data);
      }
    })
  }

  generateQuotationPdf(data: any) {
    // this.isLoading = true;
    const httpOptionsPdf = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'blob' as 'json'
    };
    this.rest.generatequotationPdf(data, httpOptionsPdf).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a')
      a.href = url;
      a.download = `quotation.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    }, error => {
      console.error('Error: ', error);
      this.isLoading = false;
    })
  }

  quotationNoGenerate() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
    };
    this.rest.quoteNoGenerate(data).subscribe((res: any) => {
      if (res.success) {
        this.quotation_number = res.response;
      }
    });
  }

  getUserDetails() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getUserDetials(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response.length > 0) {
          this.studioName = res.response[0].orgName;
          this.address = res.response[0].address + ", " + res.response[0].location;
        }
      }
    })
  }

  uploadImage() {
    let banner1 = '' as any;
    banner1 = document.getElementById('quotationTheme') as HTMLInputElement
    const file: any = banner1.files;
    if (file.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        const fileData = new FormData();
        fileData.append('file', file[0]);
        this.rest.uploadImage(fileData).subscribe((res: any) => {
          if (res.success) {
            console.log(">>>", res.response.newFilename)
            this.quotethemeImg = res.response.newFilename
            this.common.showAlertMessage(res.message, this.common.succContent);
          } else {
            this.common.showAlertMessage(res.message, this.common.errContent);
          }
        })
      };
    }
  }

  openImage() {
    const imageUrl = this.quotethemeImg ? `${this.imagePath}${this.quotethemeImg}` : 'assets/img/background/no-photo.png';
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  }
}
