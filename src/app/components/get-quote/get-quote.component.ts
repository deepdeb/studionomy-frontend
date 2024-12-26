import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
import { HttpHeaders } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


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
  htmlContent: any = '';
  specializationList = this.common.specializationList as any;

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

        // this.setHtmlContent(data);

        this.disabledSubmit = false;
        this.common.showAlertMessage(res.message, this.common.succContent);
        // this.router.navigate(['/user']);

        this.equipmemtBookingDetails = []
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

        // this.generateQuotationPdf(data);
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



  setHtmlContent(value: any) {
    this.htmlContent = `
      <html>

      <head>
      </head>

      <body>
        <div class="section_theme"
            style="background-image: url(assets/img/themes/frame/4.jpg); background-size: cover; background-position: top center; background-repeat: no-repeat; width: 800px; height: 1120px; display: table; margin: auto;">
            <table cellpadding="0" cellspacing="0" width="100%" align="center" style="text-align: center;">
                <tr>
                    <table style="padding: 0 100px; text-align: center; margin: 0 auto;">
                        <tr>
                            <td
                                style="text-align: center; padding-top: 100px; width: 200px; height: 200px; display: table; margin: auto;">
                                <img src="assets/img/logo/SL-Logo.png"
                                    style="width: 100%; height: 100%; object-fit: contain;" alt="" />
                            </td>
                        </tr>
                        <tr>
                            <td
                                style="font-family: 'Raleway', sans-serif; font-size: 28px; font-weight: 700; text-align: center;">
                                <h2 style="margin: 10px 0;">${value.studioName}</h2>
                            </td>
                        </tr>
                        <tr>
                            <td
                                style="font-size: 20px; font-family: 'PT Serif', serif; font-weight: 400; text-align: center;">
                                <strong>Address:</strong> <br />
                                <p style="margin: 5px 0; font-weight: 400; font-size: 16px;">
                                  ${value.address}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2
                                    style="font-size: 30px; font-family: 'Raleway', sans-serif; display: inline-block; border-bottom: 2px solid #000; padding-bottom: 5px; margin: 10px 0;">
                                    ${value.job_details}</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h1 style="font-family: 'PT Serif'; font-size: 42px; color: tomato; margin: 10px 0;">
                                    <p style="margin: 0; line-height: 1;">${value.job_details}</p>
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5 style="margin: 10px 0; font-size: 16px; font-family: 'Raleway', sans-serif;">On</h5>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h4
                                    style="font-size: 20px; display: flex; align-items: center; column-gap: 10px; justify-content: center; margin: 0; font-family: 'PT Serif';">
                                    <p style="margin: 0;">${value.job_startDate}</p>
                                    to
                                    <p style="margin: 0;">${value.job_endDate}</p>
                                </h4>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5 style="margin: 0px 0; font-size: 16px; font-family: 'Raleway', sans-serif;">At</h5>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2 style="font-size: 30px; margin: 0; font-family: 'PT Serif';">${value.eventLocation}</h2>
                            </td>
                        </tr>
                    </table>
                </tr>
            </table>
        </div>

        <div class="section_theme"
            style="background-image: url(assets/img/themes/frame/3.jpg); background-size: cover; background-position: top center; background-repeat: no-repeat; width: 800px; height: 1180px; display: table; margin: auto;">
            <table cellpadding="0" cellspacing="0" width="100%" align="center" style="text-align: center; margin: 0 auto;">
                <tr>
                    <td>
                        <table style="padding: 100px 40px 100px 65px; text-align: center; width: 100%;">
                            <tr>
                                <td style="width: 25%;">
                                    <img src="assets/img/logo/SL-Logo.png"
                                        style="width: 100%; height: 100%; object-fit: cover;" alt="">
                                </td>
                                <td style="width: 75%; vertical-align: top; text-align: left; padding-left: 30px;">
                                    <h2
                                        style="font-family: 'PT Serif'; font-size:25px; font-weight: 700; margin: 0 0 5px 0; text-transform: uppercase;">
                                        ${value.cust_firstName}</h2>
                                    <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 5px 0;">${value.cust_phoneNo} /
                                        ${value.cust_altPhoneNo}</h2>
                                    <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 5px 0;">COST - ${value.total_amt}</h2>
                                    <h2
                                        style="font-family: 'PT Serif'; font-size: 20px; font-weight: 700; margin: 0 0 5px 0;">
                                        Projects Description:</h2>
                                    <p
                                        style="font-size: 16px; font-family: 'PT Serif'; line-height: 25px; margin-top: 10px;">
                                        ${value.projectDesc}</p>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <table style="width: 100%; border-collapse: collapse;" border="0">
                                        <tr>
                                            <th style="width: 100%;">
                                                <h2
                                                    style="margin: 0;text-align: left; font-size: 18px; font-family: 'PT Serif'; font-weight: 700; border-bottom: 2px solid black;">
                                                    Days - Crew Details(${value.eventLocation})</h2>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td
                                                style="display: flex; font-family: 'PT Serif'; gap: 10px; text-align: left; border-bottom: 1px solid #e5e5e5; padding: 10px 0;">
                                                <strong>23.01.2024</strong>
                                                <p style="margin: 0; text-transform: capitalize; font-size: 14px;">1
                                                    Photographer, 1 Videographer, 1 Candid Photgrapher, 1 Cinematographer 1
                                                    Cinematographer 1 Cinematographer1 Cinematographer1 Cinematographer</p>
                                                <p style="white-space: nowrap; margin: 0;">4 Crew</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="display: flex; font-family: 'PT Serif'; gap: 10px; text-align: left; border-bottom: 1px solid #e5e5e5; padding: 10px 0;">
                                                <strong>23.01.2024</strong>
                                                <p style="margin: 0; text-transform: capitalize; font-size: 14px;">1
                                                    Photographer, 1 Videographer, 1 Candid Photgrapher, 1 Cinematographer 1
                                                    Cinematographer 1 Cinematographer1 Cinematographer1 Cinematographer</p>
                                                <p style="white-space: nowrap; margin: 0;">4 Crew</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="display: flex; font-family: 'PT Serif'; gap: 10px; text-align: left; border-bottom: 1px solid #e5e5e5; padding: 10px 0;">
                                                <strong>23.01.2024</strong>
                                                <p style="margin: 0; text-transform: capitalize; font-size: 14px;">1
                                                    Photographer, 1 Videographer, 1 Candid Photgrapher, 1 Cinematographer 1
                                                    Cinematographer 1 Cinematographer1 Cinematographer1 Cinematographer</p>
                                                <p style="white-space: nowrap; margin: 0;">4 Crew</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </div>

        <div class="section_theme"
            style="background-image: url(assets/img/themes/frame/3.jpg); background-size: cover; background-position: top center; background-repeat: no-repeat; width: 800px; height: 1180px; display: table; margin: auto;">
            <table cellpadding="0" cellspacing="0" width="100%" align="center" style="text-align: center;">
                <tr>
                    <table style="padding: 100px 40px 100px 65px; text-align: center; width: 100%;">

                        <tr>
                            <td style="text-align: left;" colspan="2">
                                <h2
                                    style="text-transform: uppercase; font-family: 'PT Serif'; font-size: 18px; margin: 5px 0;">
                                    Deliverables</h2>
                                <ul style="margin: 0;">
                                    <li>
                                        <p style="margin: 5px 0; font-size: 15px; font-family: 'PT Serif';">
                                          ${value.deliverables}
                                        </p>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;">
                                <h2 style="text-transform: uppercase; font-family: 'PT Serif'; font-size: 18px; margin: 0;">
                                  ${value.customName}</h2>
                                <p style="margin: 10px 0;">
                                  ${value.customValue}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left;" colspan="2">
                                <h2 style="text-transform: uppercase; font-family: 'PT Serif'; font-size: 18px; margin: 0;">
                                    Terms & Conditions</h2>
                                <ul style="margin: 0;">
                                    <li>
                                        <p style="margin: 5px 0; font-size: 15px; font-family: 'PT Serif';">
                                          ${value.termscondition}
                                        </p>
                                    </li>
                                </ul>
                            </td>
                        </tr>

                    </table>
                </tr>
            </table>
        </div>
        </div>
      </body>

      </html>`;

    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = this.htmlContent;

    document.body.appendChild(contentContainer);

    this.generatePDF(contentContainer);

    document.body.removeChild(contentContainer);
  }



  generatePDF(contentContainer: HTMLElement) {
    const sections = contentContainer.querySelectorAll('.section_theme');

    const pdf = new jsPDF('p', 'mm', 'a4');

    sections.forEach((section: any, index) => {

      html2canvas(section, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const aspectRatio = canvasWidth / canvasHeight;

        const pageWidth = 210; 
        const pageHeight = 297;

        let imgWidth = pageWidth;
        let imgHeight = pageWidth / aspectRatio;

        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
          imgWidth = pageHeight * aspectRatio;
        }

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

        if (index == sections.length - 1) {
          pdf.save('quotePDF.pdf');
        }
      });
    });
  }

}
