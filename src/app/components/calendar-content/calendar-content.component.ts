import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
@Component({
  selector: 'app-calendar-content',
  templateUrl: './calendar-content.component.html',
  styleUrls: ['./calendar-content.component.css']
})
export class CalendarContentComponent {
  job_id = "" as any;
  job_details = "";
  job_number = "";
  job_startDate = "";
  job_endDate = ""
  products = "";
  equipments = "";
  event_location = "";
  cust_name = "";
  cust_phoneNo = "";
  cust_email = "";
  cust_address = "";
  total_amount = "";
  booking_amount = "";
  expense = "";
  total_paid_amount = "";
  due_amount = "";
  empName = "";
  external_employee = "";
  equipmentEmployeeDetails: any = [];
  studioRole = '' as any;
  constructor(
    public dialogRef: MatDialogRef<CalendarContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private rest: RestService
  ) {
    this.job_id = data.content.job_id;
    this.job_details = data.content.job_details;
    this.job_number = data.content.job_number;
    this.getEquipmentsEmployee();
    this.job_startDate = data.content.job_startDate;
    this.job_endDate = data.content.job_endDate;
    this.products = data.content.products ? data.content.products.split(",") : [];
    this.equipments = data.content.equipments ? data.content.equipments.split(",") : [];
    this.empName = data.content.empName ? data.content.empName.split(",") : [];
    this.external_employee = data.content.external_employee ? data.content.external_employee.split(",") : [];
    this.event_location = data.content.event_location;
    this.cust_name = data.content.cust_name;
    this.cust_phoneNo = data.content.cust_phoneNo;
    this.cust_email = data.content.cust_email;
    this.cust_address = data.content.cust_address;
    this.total_amount = data.content.total_amount;
    this.booking_amount = data.content.booking_amount;
    this.total_paid_amount = data.content.total_paid_amount;
    this.due_amount = data.content.due_amount;
    this.expense = data.content.expenses;
  }

  ngOnInit() {
    this.studioRole = localStorage.getItem('studioRole');
  }

  onClose(): void {
    this.dialogRef.close();
  }
  editJob(job_id: any) {
    this.onClose();
    this.router.navigate(['job/' + job_id]);
  }
  goToNetwork() {
    this.onClose();
    let queryParams = {
      job_number: this.job_number,
      job_details: this.job_details,
      event_location: this.event_location,
      job_startDate: this.job_startDate,
      job_endDate: this.job_endDate
    }
    this.router.navigate(['network'], {queryParams: queryParams});
  }

  getEquipmentsEmployee() {
    const data = {
      job_id: this.job_id,
      job_number: this.job_number,
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getEquipmentsEmployee(data).subscribe((res: any) => {
      if (res.success) {
        this.equipmentEmployeeDetails = Object.values(res.response.reduce((acc: any, obj: any) => {
          const key = obj.booked_from;
          acc[key] = acc[key] || { booked_from: key };
          Object.assign(acc[key], obj);
          return acc;
        }, {}));
      }
    });
  }

  dateFormat(date: any) {
    var myDate = new Date(date);
    var finalDate = myDate.toISOString().split("T")[0]
    var tempDate = myDate.toISOString().split("T")[1];
    const [year, month, day] = finalDate.split('-');
    const result = [year, month, day].join('-');
    return result;
  }
}