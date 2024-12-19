import { Component, ViewChild } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  userId = "" as any;
  profile_share = "" as any;
  userType = "" as any;
  name = "";
  studioName = "";
  email = "";
  mobile = "";
  alt_mobile = "";
  address1 = "";
  address2 = "";
  aboutYouself = "";
  aboutReference = "";
  aboutWork = "";
  FBLink = "";
  InstaLink = "";
  YoutubeLink = "";
  jdLink = "";
  websiteLink = "";
  linkedInLink = "";
  workImg1 = "";
  profileImg = "";
  workImg3 = "";
  aboutusImg = "";
  reffeedbackImg = "";
  country = "1" as any;
  jobList: any = [];
  quotationList: any = [];
  buysubscriptionList: any = [];
  joblimit: number = 10;
  joboffset: number = 0;
  jobType = "upcoming"
  subscriptionlimit: number = 10;
  subscriptionoffset: number = 0;
  job_id = "" as any;
  stateList: any = []
  state_id = "" as any;
  country_id = "" as any;
  pin = "";
  address = "";
  city = "";
  userLocation = "";
  reference = "" as any;
  //------------------------------ For Job----------------------------//
  job_number = "" as any;
  job_details = "";
  quotation_number = "";
  event_location = "";
  job_startDate = "";
  job_endDate = "";
  cust_name = "";
  cust_phoneNo = "";
  total_amount: any = 0.00;
  due_amount: any = 0.00;
  total_paid_amount: any = 0.00;
  last_paid_amount: any = 0.00;
  payAmount: any;
  jobCount = 0;
  quotationCount = 0;
  pageList = this.common.pageList;
  totalInventary = 0;
  forJobEditDeletePermission: any
  todatDate = new Date().toISOString().split('T')[0];
  quotationType = "upcoming";
  studioRole: any
  imagePath = this.rest.imagePath;
  job_search_criteria = '' as any;
  quote_search_criteria = '' as any;
  isLoading = false;
  mainJobsRemaining: any;
  changePasswordOTP: any;
  oldPassword: any;
  newPassword: any;
  emailSentMsg: any;
  toRegisteredMail: any;
  generatedOTP: any;
  htmlContent: any = ''

  //**************************************** For Job report ************************************//
  startDate = "";
  endDate = "";
  todayDate = new Date().toISOString().split('T')[0];


  @ViewChild('PasswordChange') changePasswordModal: any;

  constructor(private rest: RestService, private snackBar: MatSnackBar, private router: Router, private location: Location, private common: CommonService, private route: ActivatedRoute, private dialog: MatDialog) {
    this.forJobEditDeletePermission = this.common.convertOnlyDate(this.todatDate);
    this.userId = localStorage.getItem('slUserId');
    this.userType = localStorage.getItem('slUserType');
  }

  ngOnInit() {
    this.setSubscriptionActiveStatus();
    this.getUserDetails();
    this.getAllJob();
    this.getAllQuotes();
    this.getAllBuySubscriptionList();
    this.getStateList();
    this.studioRole = localStorage.getItem('studioRole');
  }

  setSubscriptionActiveStatus() {
    this.rest.setSubscriptionActiveStatus().subscribe((res:any) => {
      
    })
  }

  getUserDetails() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getUserDetials(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response.length > 0) {
          this.totalInventary = res.response[0].totalInventary;
          this.profile_share = res.response[0].profile_share;
          this.studioName = res.response[0].orgName;
          localStorage.setItem('studioName', res.response[0].orgName);
          localStorage.setItem('name', res.response[0].name);
          this.name = res.response[0].name;
          this.mobile = res.response[0].mobile;
          this.alt_mobile = res.response[0].alt_mobile;
          this.email = res.response[0].email;
          this.country = res.response[0].country_name;
          this.country_id = res.response[0].country_id;
          this.workImg3 = res.response[0].workImg3;
          this.aboutusImg = res.response[0].aboutusImg;
          this.reffeedbackImg = res.response[0].reffeedbackImg
          this.YoutubeLink = res.response[0].YoutubeLink;
          this.FBLink = res.response[0].FBLink;
          this.websiteLink = res.response[0].websiteLink;
          this.jdLink = res.response[0].jdLink;
          this.linkedInLink = res.response[0].linkedInLink;
          this.InstaLink = res.response[0].InstaLink;
          this.aboutYouself = res.response[0].aboutYouself;
          this.aboutWork = res.response[0].aboutWork;
          this.aboutReference = res.response[0].aboutReference;
          this.state_id = res.response[0].state_id;
          this.pin = res.response[0].pin;
          this.userLocation = res.response[0].location;
          this.address = res.response[0].address;
          this.city = res.response[0].city;
          this.reference = res.response[0].reference;
          if (this.country == 1) {
            this.country = "India";
          }
          this.address1 = res.response[0].address + ", " + res.response[0].location;
          this.address2 = res.response[0].city + ", " + res.response[0].pin + ", " + res.response[0].state_name;
        }
      }
    })
  }
  getStateList() {
    this.rest.getStateList().subscribe((res: any) => {
      if (res.success) {
        this.stateList = res.response;
      }
    })
  }

  getAllJob() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      limit: this.joblimit,
      offset: this.joboffset,
      jobType: this.jobType,
      job_details: this.job_details,
      cust_name: this.cust_name,
      cust_phoneNo: this.cust_phoneNo,
      job_search_criteria: this.job_search_criteria
    };
    this.jobList = [];
    this.rest.getAllJobList(data).subscribe((res: any) => {
      if (res.success) {
        this.jobList = res.response;
        this.jobCount = res.totalCount;
      }
    })
  }

  getAllQuotes() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      limit: this.joblimit,
      offset: this.joboffset,
      quotationType: this.quotationType,
      quotation_number: this.quotation_number,
      cust_name: this.cust_name,
      cust_phoneNo: this.cust_phoneNo,
      quote_search_criteria: this.quote_search_criteria
    };
    this.quotationList = [];
    this.rest.getAllQuoteList(data).subscribe((res: any) => {
      if (res.success) {
        this.quotationList = res.response;
        this.quotationCount = res.totalCount;
      }
    })
  }

  gotoLink(url: any) {
    window.open(url);
  }

  checkProfileValue(event: any) {
    this.profile_share = event.target.value;
  }
  shareProfile() {
    if (this.profile_share == "" || this.profile_share == null || this.profile_share == undefined) {
      this.common.showAlertMessage("Please choose any one", this.common.errContent);
      return;
    }
    const data = {
      userId: localStorage.getItem('slUserId'),
      profile_share: this.profile_share
    };
    this.rest.shareProfile(data).subscribe((res: any) => {
      if (res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.getUserDetails();
      }
    })
  }

  removeJob(job_id: any) {
    this.job_id = job_id;
  }
  deleteJob() {
    const data = {
      id: this.job_id,
      table_name: "jobs",
      table_pId: "job_id",
      userId: localStorage.getItem('slUserId')
    };
    this.rest.delete(data).subscribe((res: any) => {
      if (res.success) {
        this.job_id = "";
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.getAllJob();
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }

  editJob(job_id: any) {
    this.router.navigate(['job/' + job_id]);
  }

  updateUser() {
    this.router.navigate(['user-update']);
  }

  // payForJob(job_id: any, job_number: any, job_details: any, event_location: any, job_startDate: any, job_endDate: any, cust_name: any, cust_phoneNo: any, total_amount: any, total_paid_amount: any, last_paid_amount: any, due_amount: any) {
  //   this.job_id = job_id;
  //   this.job_number = job_number;
  //   this.job_details = job_details;
  //   this.event_location = event_location;
  //   this.job_startDate = this.dateFormat(job_startDate);
  //   this.job_endDate = this.dateFormat(job_endDate);
  //   this.cust_name = cust_name;
  //   this.cust_phoneNo = cust_phoneNo;
  //   this.total_amount = total_amount;
  //   this.total_paid_amount = total_paid_amount;
  //   this.last_paid_amount = last_paid_amount;
  //   this.due_amount = due_amount;
  // }

  payJobAmount() {
    if (this.job_id <= 0 || this.job_id == "" || this.job_id == null || this.job_id == undefined) {
      this.common.showAlertMessage("You can not pay for this job", this.common.errContent);
      return;
    }
    if (this.job_number == "" || this.job_number == null || this.job_number == undefined) {
      this.common.showAlertMessage("Job number must be required", this.common.errContent);
      return;
    }
    if (this.job_details == "" || this.job_details == null || this.job_details == undefined) {
      this.common.showAlertMessage("Job details must be required", this.common.errContent);
      return;
    }
    if (this.event_location == "" || this.event_location == null || this.event_location == undefined) {
      this.common.showAlertMessage("Event location must be required", this.common.errContent);
      return;
    }
    if (this.job_startDate == "" || this.job_startDate == null || this.job_startDate == undefined) {
      this.common.showAlertMessage("Job start date must be required", this.common.errContent);
      return;
    }
    if (this.cust_name == "" || this.cust_name == null || this.cust_name == undefined) {
      this.common.showAlertMessage("Customer name must be required", this.common.errContent);
      return;
    }
    if (this.cust_phoneNo == "" || this.cust_phoneNo == null || this.cust_phoneNo == undefined) {
      this.common.showAlertMessage("phone no must be required", this.common.errContent);
      return;
    }
    if (this.total_amount == "" || this.total_amount == null || this.total_amount == undefined) {
      this.common.showAlertMessage("Total amount be required", this.common.errContent);
      return;
    }
    if (this.payAmount == "" || this.payAmount == null || this.payAmount == undefined || this.payAmount == 0) {
      this.common.showAlertMessage("Payment amount must be required", this.common.errContent);
      return;
    }
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      job_id: this.job_id,
      payment_amount: this.payAmount
    };

    this.rest.paymentForJob(data).subscribe((res: any) => {
      if (res.success) {
        this.getAllJob();
        this.common.showAlertMessage(res.message, this.common.succContent);
      }
    })
  }

  changePageLimitJob(event: any) {
    this.joblimit = Number(event.target.value);
    this.getAllJob();
  }


  dateFormat(date: any) {
    var myDate = new Date(date);
    var finalDate = myDate.toISOString().split("T")[0]
    const [year, month, day] = finalDate.split('-');
    const result = [year, month, day].join('-');
    return result;
  }


  next() {
    var middleX = window.innerWidth / 2;
    var middleY = window.innerHeight / 2;
    window.scrollTo(middleX, middleY);
    this.joboffset = this.joboffset + this.joblimit;
    this.getAllJob();
  }

  previous() {
    this.joboffset = this.joboffset > 0 ? this.joboffset - this.joblimit : 0;
    this.getAllJob();
  }

  newDateFormat(date: any) {
    var genDate: any = new Date(date).toISOString().split('T')[0];
    return genDate;
  }
  calculateDueAmount() {
    this.due_amount = Number(this.total_amount) - Number(this.total_paid_amount) - Number(this.payAmount);
  }

  goToPaymentDetails(job_id: any) {
    console.log(job_id);
    this.router.navigate(['payment-details/' + job_id]);
  }
  //------------------Date Compare -----------/
  compareDates(job_endDate: any): any {
    var date1 = this.common.dateFormatYearMonthDate(job_endDate);
    return date1;
  }
  jobReport() {
    if(!this.startDate) {
      this.common.showAlertMessage('Select start date', this.common.errContent);
      return
    }
    if(!this.endDate) {
      this.common.showAlertMessage('Select end date,', this.common.errContent);
      return
    }
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      limit: this.joblimit,
      offset: this.joboffset,
      jobType: this.jobType,
      job_details: this.job_details,
      cust_name: this.cust_name,
      cust_phoneNo: this.cust_phoneNo,
      start_date: this.startDate,
      end_date: this.endDate
    };
    this.rest.getAllJobListReport(data).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jobreport.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      // Handle error
      console.error('Error:', error);
    });
  }

  searchJob() {
    this.getAllJob();
  }

  searchQuotation() {
    this.getAllQuotes();
  }

  clearSearchJob() {
    this.job_details = "";
    this.cust_name = "";
    this.cust_phoneNo = "";
    this.getAllJob();
  }
  allJob() {
    this.jobType = "all";
    this.getAllJob();
  }
  upcomingJob() {
    this.jobType = "upcoming";
    this.getAllJob();
  }
  pastJob() {
    this.jobType = "past";
    this.getAllJob();
  }

  closedJob() {
    this.jobType = "closed";
    this.getAllJob();
  }

  allQuotation() {
    this.quotationType = "all"
    this.getAllQuotes();
  }
  upcomingQuotation() {
    this.quotationType = "upcoming"
    this.getAllQuotes();
  }

  pastQuotation() {
    this.quotationType = "past"
    this.getAllQuotes();
  }

  closedQuotation() {
    this.quotationType = "closed"
    this.getAllQuotes();
  }

  convertToJob(quotation_number: any) {
    this.getQuoteByQuoteNum(quotation_number);
  }

  shareProfileToWhatsapp() {
    const text = encodeURIComponent(`*Visit my profile:*\n\nhttps://studionomy.com/#/user-detail/${this.userId}`);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=&text=${text}`;
    window.open(whatsappUrl, '_blank');
  }

  getQuoteByQuoteNum(quotation_number: any) {
    const data = {
      quotation_number,
      userId: this.userId,
      userType: this.userType
    }
    this.rest.getQuoteByQuoteNum(data).subscribe((res: any) => {
      if(res.success) {
        console.log("res>>", res.response)
        let queryParams = {
          job_details: res.response[0].job_details,
          job_startDate: this.common.convertOnlyDate(res.response[0].job_startDate),
          job_endDate: this.common.convertOnlyDate(res.response[0].job_endDate),
          deliverables: res.response[0].deliverables,
          cust_firstName: res.response[0].cust_firstName,
          cust_lastName: res.response[0].cust_lastName,
          cust_phoneNo: res.response[0].cust_phoneNo,
          cust_altPhoneNo: res.response[0].cust_altPhoneNo,
          cust_email: res.response[0].cust_email,
          event_location: res.response[0].event_location,
          total_amount: res.response[0].total_amount,
        }
        this.router.navigate(['job'], {queryParams})
      }
    })
  }

  getAllBuySubscriptionList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: this.userType,
      limit: this.subscriptionlimit,
      offset: this.subscriptionoffset
    };
    this.rest.getAllBuySubscriptionList(data).subscribe((res: any) => {
      if (res.success) {
        this.buysubscriptionList = res.response;
        this.mainJobsRemaining = res.main_jobs_remaining;
      }
    })
  }

  goToJob() {
    // if(this.buysubscriptionList.length == 0 || this.mainJobsRemaining.length > 0) {
    //   this.common.showAlertMessage('No main plan found. Buy subscription to add jobs', this.common.errContent);
    //   this.router.navigate(['subscription']);
    //   return
    // }
    if (this.totalInventary > 0 && this.userType == "0") { 
      this.router.navigate(['job']);
    } else {
      this.common.showAlertMessage("First add your inventary then add the job", this.common.errContent);
      return;
    }
  }

  changePassword() {
    if(this.userId == 5) {
      this.common.showAlertMessage('Action denied for this account', this.common.errContent);
      return
    } else {
      this.openChangePasswordModal();
    }
  }

  openChangePasswordModal(): void {
    const dialogRef = this.dialog.open(this.changePasswordModal, {
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  checkAndChangePassword() {
    const data = {
      changePasswordOTP: this.changePasswordOTP,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      userId: this.userId
    }
    this.rest.checkAndChangePassword(data).subscribe((res: any) => {
      if(res.success) {
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.changePasswordOTP = '';
        this.oldPassword = '';
        this.newPassword= '';
        this.closeModal();
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }

  sendOTPMail() {
    this.getDetailsByEmail();
  }

  getDetailsByEmail() {
    const data = {
      toRegisteredMail: this.toRegisteredMail
    }
    this.rest.getUserDetailsByEmail(data).subscribe((res: any) => {
      if(res.success) {
        this.generatedOTP = this.common.generateOTP();
        this.sendMail();
        // this.openOTPEnterModal();
      } else {
        this.common.showAlertMessage('Email not registered', this.common.errContent)
      }
    })
  }

  sendMail() {
    const data = {
      toRegisteredMail: this.toRegisteredMail,
      sentOTP: this.generatedOTP
    }
    this.rest.sendMail(data).subscribe((res: any) => {
      if (res.success) {
        this.emailSentMsg = res.message;
        this.updateOTPinDB();
      }
    })
  }

  updateOTPinDB() {
    const data  = {
      userId: this.userId,
      generatedOTP: this.generatedOTP
    }
    this.rest.updateOTPinDB(data).subscribe((res: any) => {
    })
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

  getQuote(item: any) {
    const bookingDate = item.bookingDate.split(',');
    const specialization = item.specialization.split(',');
    const crew = item.crew.split(',')
    this.setHtmlContent(item, bookingDate, specialization, crew);
  }


  setHtmlContent(value: any, bookingDate: any, specialization: any, crew: any) {
    this.htmlContent = `
<html>
<head>
</head>
<body>

  <div class="section_theme clearfix">
    <div class="header-section"></div>
    <div class="title-section">
      <h2>Studio Name</h2>
    </div>
    <div class="address-section">
      <strong>Address:</strong>
      <p>123 Studio Address</p>
    </div>
    <div class="job-details">
      <h2>Job Details</h2>
    </div>
    <div class="job-summary">
      <h1>
        <span>Job Details</span>
        <span>&</span>
        <span>Job Details</span>
      </h1>
    </div>
    <div class="date-section">
      <h5>On</h5>
      <h4>
        <span>2024-01-01</span> to <span>2024-01-10</span>
      </h4>
    </div>
    <div class="event-location">
      <h5>At</h5>
      <h2>Event Location</h2>
    </div>
  </div>

  <div class="section_theme clearfix">
    <div class="customer-info">
      <h2>Customer Name</h2>
      <h2>+1234567890 / +0987654321</h2>
      <h2>COST - $5000</h2>
      <h2>Projects Description:</h2>
      <p>Project description goes here.</p>
    </div>
    <div class="crew-details">
      <h2>Days - Crew Details (All Events in Event Location)</h2>
      <div class="crew-details-table">
        <div>
          <strong>2024-01-01</strong>
          <p>Specialization 1</p>
          <p>Crew 1 Name</p>
        </div>
        <div>
          <strong>2024-01-02</strong>
          <p>Specialization 2</p>
          <p>Crew 2 Name</p>
        </div>
        <div>
          <strong>2024-01-03</strong>
          <p>Specialization 3</p>
          <p>Crew 3 Name</p>
        </div>
      </div>
    </div>
  </div>

  <div class="section_theme clearfix">
    <div class="deliverables-section">
      <h2>Deliverables</h2>
      <div class="deliverables-list">
        <ul>
          <li><p>Deliverable description goes here.</p></li>
        </ul>
      </div>
      <h2>Custom Field Name</h2>
      <div class="custom-field-table">
        <div>
          <div>Custom Field Name</div>
          <div>Custom Field Value</div>
        </div>
      </div>
      <h2>Terms & Conditions</h2>
      <div class="terms-list">
        <ul>
          <li><p>Terms and conditions text goes here.</p></li>
        </ul>
      </div>
    </div>
  </div>

</body>
</html>
`;

    // Create a temporary div element to hold the HTML content
    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = this.htmlContent;

    // Append this container to the DOM (but not visible to the user)
    document.body.appendChild(contentContainer);

    console.log('html content >>>>>', this.htmlContent)
    // Call the function to generate PDF
    this.generatePDF(contentContainer);
    

    // Optionally, remove the temporary container from the DOM after the PDF generation
    document.body.removeChild(contentContainer);
  }

  generatePDF(contentContainer: HTMLElement) {
    const sections = contentContainer.querySelectorAll('.section_theme');
  
    // Initialize jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');
  
    sections.forEach((section: any, index) => {
      const textElements = section.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
      
      // Apply styling for text elements, adjust font size to ensure readability
      textElements.forEach((element: HTMLElement) => {
        element.style.fontSize = '40px'; // Change to a reasonable font size for printing
      });
  
      // Render the section into a canvas using html2canvas
      html2canvas(section, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
  
        // Get the canvas dimensions (width and height)
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
  
        // Calculate aspect ratio
        const aspectRatio = canvasWidth / canvasHeight;
  
        // Set the max width and height for an A4 page
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
  
        // Calculate image dimensions to fit within A4 page
        let imgWidth = pageWidth;
        let imgHeight = pageWidth / aspectRatio;
  
        // Adjust if the height exceeds A4 page height
        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
          imgWidth = pageHeight * aspectRatio;
        }
  
        // If not the first section, add a new page
        if (index > 0) {
          pdf.addPage();
        }
  
        // Add the rendered image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  
        // Once all sections are processed, save the PDF
        if (index == sections.length - 1) {
          pdf.save('quotePDF.pdf');
        }
      });
    });
  }  

}
