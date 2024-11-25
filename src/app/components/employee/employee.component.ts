import { Component, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { RestService } from 'src/app/services/rest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {

  //-------------------Employee---------------------//
  emp_id = 0 as any;
  empName = "";
  empPhone = "";
  empAltPhone = "";
  empEmail = "";
  empAddr = "";
  empDateOfJoin = "";
  employeelimit: number = 10;
  employeeoffset: number = 0;
  employeeList: any = [];
  empTotal = 0;
  search_emp_id = 0 as any;

  //---------------- Freelancer -----------------------------//
  freelancerId = 0 as any;
  freelancerName = "";
  freelancerPhone = "";
  freelancerEmail = "";
  freelancerAddr = "";
  freelancerDateOfJoin = "";
  freelancerList: any = [];
  freelancerTotal = 0;
  freelancerlimit: number = 10;
  freelanceroffset: number = 0;
  allFreelancerList: any = [];
  search_freelancerId = 0 as any;

  //------------------- Employee Attendance -----------------------//
  empAttnArrar: any = [];
  //empAttnArrar: any = [{ "emp_id": '', "emp_attn_name": '', "emp_attendance": '', "emp_outdoor_hrs": '', "empRemarks": '' }]
  empAttnTotal = 0;
  empAttn_id = 0 as any;
  emp_id_for_attn = 0 as any;
  allEmployeeList: any = [];
  employeeAttnlimit: number = 10;
  employeeAttnoffset: number = 0;
  employeeAttendanceList: any = [];
  userType = "" as any;
  today = new Date().toISOString().split("T")[0];
  attnDate = this.today;
  empEntryTime = this.today;
  //startDate = "";
  //endDate = this.today;
  todayTime = this.common.convertDateTime(new Date().toISOString());
  pageList = this.common.pageList;
  monthList = this.common.monthList;
  editForEmpName = "" as any;
  editFlag = false;
  dialogRef: any;
  empAttendance = '';
  empOutdoorHours = '';
  empRemarks = '';

  @ViewChild('editAttn') editAttnModal: any;

  //--------------- Attendance--------------//

  currentDate: any = new Date();

  year = this.currentDate.getFullYear();
  prevTwo = this.year - 2;
  perYear = this.year - 1;
  selectYear = this.year;
  month = this.currentDate.getMonth();
  currentMonthNo = this.month + 1;
  selectcurrentMonthNo = this.currentMonthNo;
  monthName = this.getMonthName(this.currentMonthNo.toString());

  daysInMonth: any = this.getDaysInMonth(this.year, this.month);

  constructor(private rest: RestService, private router: Router, private location: Location, private common: CommonService, private activateRoute: ActivatedRoute, private dialog: MatDialog) {
    this.userType = localStorage.getItem('slUserType');
  }

  ngOnInit() {
    if (localStorage.getItem('slUserType') != "1" && localStorage.getItem('slUserId')) {
      this.getSomeEmployee(0);
      this.getSomeFreelancer(0);
      this.getAllEmployee();
      this.getAllFreelancer();
      this.getEmployeeAttendanceList();
    } else if (localStorage.getItem('slUserType') == "1" && localStorage.getItem('slUserId')) {
      this.router.navigate(['user']);
    } else {
      this.router.navigate(['/']);
    }
  }
  //------------------ Employee section----------------//

  employeeSubmit() {
    if (this.userType == "" || this.userType == null || this.userType == undefined || this.userType == '1') {
      this.common.showAlertMessage("You can not add the employee", this.common.errContent);
      return;
    }
    if (this.empName == "" || this.empName == null || this.empName == undefined) {
      this.common.showAlertMessage("Please enter name", this.common.errContent);
      return;
    }
    if (this.empPhone == "" || this.empPhone == null || this.empPhone == undefined) {
      this.common.showAlertMessage("Please enter phone no", this.common.errContent);
      return;
    }
    if (this.empPhone != null && this.empPhone != "" && this.empPhone != undefined) {
      if (this.common.phoneNumberFormat(this.empPhone) == false) {
        this.common.showAlertMessage("Please enter valid phone no", this.common.errContent);
        return;
      }
    }
    if (this.empAltPhone != null && this.empAltPhone != "" && this.empAltPhone != undefined) {
      if (this.common.phoneNumberFormat(this.empAltPhone) == false) {
        this.common.showAlertMessage("Please enter valid alternate phone no", this.common.errContent);
        return;
      }
    }
    // if (this.empEmail == "" || this.empEmail == null || this.empEmail == undefined) {
    //   this.common.showAlertMessage("Please enter email", this.common.errContent);
    //   return;
    // }
    if (this.empEmail != null && this.empEmail != "" && this.empEmail != undefined) {
      if (this.common.mailFormatCheck(this.empEmail) == false) {
        this.common.showAlertMessage("Please enter valid email", this.common.errContent);
        return;
      }
    }
    if (this.empAddr == "" || this.empAddr == null || this.empAddr == undefined) {
      this.common.showAlertMessage("Please enter address", this.common.errContent);
      return;
    }
    if (this.empDateOfJoin == "" || this.empDateOfJoin == null || this.empDateOfJoin == undefined) {
      this.common.showAlertMessage("Please choose date of joinning", this.common.errContent);
      return;
    }
    const data = {
      emp_id: this.emp_id,
      empName: this.empName,
      empPhone: this.empPhone,
      empAltPhone: this.empAltPhone,
      empEmail: this.empEmail,
      empAddr: this.empAddr,
      empDateOfJoin: this.empDateOfJoin,
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.submitEmployee(data).subscribe((res: any) => {
      if (res.success) {
        this.emp_id = 0;
        this.getSomeEmployee(0);
        this.empName = "";
        this.empEmail = "";
        this.empPhone = "";
        this.empAltPhone = "";
        this.empAddr = "";
        this.empDateOfJoin = "";
        this.getAllEmployee();
        this.common.showAlertMessage(res.message, this.common.succContent);
      }
    })
  }

  //--------------------- Freelancer Section -----------------------//

  freelancerSubmit() {
    if (this.userType == "" || this.userType == null || this.userType == undefined || this.userType == '1') {
      this.common.showAlertMessage("You can not add the freelancer", this.common.errContent);
      return;
    }
    if (this.freelancerName == "" || this.freelancerName == null || this.freelancerName == undefined) {
      this.common.showAlertMessage("Please enter name", this.common.errContent);
      return;
    }
    if (this.freelancerPhone == "" || this.freelancerPhone == null || this.freelancerPhone == undefined) {
      this.common.showAlertMessage("Please enter phone no", this.common.errContent);
      return;
    }
    if (this.freelancerPhone != null && this.freelancerPhone != "" && this.freelancerPhone != undefined) {
      if (this.common.phoneNumberFormat(this.freelancerPhone) == false) {
        this.common.showAlertMessage("Please enter valid phone no", this.common.errContent);
        return;
      }
    }
    // if (this.freelancerEmail == "" || this.freelancerEmail == null || this.freelancerEmail == undefined) {
    //   this.common.showAlertMessage("Please enter email", this.common.errContent);
    //   return;
    // }
    if (this.freelancerEmail != null && this.freelancerEmail != "" && this.freelancerEmail != undefined) {
      if (this.common.mailFormatCheck(this.freelancerEmail) == false) {
        this.common.showAlertMessage("Please enter valid email", this.common.errContent);
        return;
      }
    }
    if (this.freelancerAddr == "" || this.freelancerAddr == null || this.freelancerAddr == undefined) {
      this.common.showAlertMessage("Please enter address", this.common.errContent);
      return;
    }
    if (this.freelancerDateOfJoin == "" || this.freelancerDateOfJoin == null || this.freelancerDateOfJoin == undefined) {
      this.common.showAlertMessage("Please choose date of joinning", this.common.errContent);
      return;
    }
    const data = {
      freelancerId: this.freelancerId,
      freelancerName: this.freelancerName,
      freelancerPhone: this.freelancerPhone,
      freelancerEmail: this.freelancerEmail,
      freelancerAddr: this.freelancerAddr,
      freelancerDateOfJoin: this.freelancerDateOfJoin,
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.submitFreelancer(data).subscribe((res: any) => {
      if (res.success) {
        this.freelancerId = 0;
        this.getSomeFreelancer(0);
        this.freelancerName = "";
        this.freelancerEmail = "";
        this.freelancerPhone = "";
        this.freelancerAddr = "";
        this.freelancerDateOfJoin = "";
        this.getAllFreelancer();
        this.common.showAlertMessage(res.message, this.common.succContent);
      }
    })
  }


  clearfreelancer() {
    this.freelancerId = 0;
    this.freelancerName = "";
    this.freelancerPhone = "";
    this.freelancerAddr = "";
    this.freelancerDateOfJoin = "";
    this.freelancerEmail = "";
  }
  getSomeEmployee(time: any) {
    const data = {
      limit: this.employeelimit,
      offset: this.employeeoffset,
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      emp_id: time == "0" ? this.emp_id : this.search_emp_id
    };
    this.rest.getEmployeeList(data).subscribe((res: any) => {
      if (res.success) {
        this.employeeList = [];
        this.employeeList = res.response;
        this.empTotal = res.totalCount;
      }
    })
  }

  //---------------- Freelancer----------------//

  getSomeFreelancer(time: any) {
    const data = {
      limit: this.freelancerlimit,
      offset: this.freelanceroffset,
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      freelancerId: time == "0" ? this.freelancerId : this.search_freelancerId
    };
    this.rest.getFreelancerList(data).subscribe((res: any) => {
      if (res.success) {
        this.freelancerList = [];
        this.freelancerList = res.response;
        this.freelancerTotal = res.totalCount;
      }
    })
  }

  //--------------------------------- Employee Edit Delete---------------------//


  removeEmp(emp_id: any) {
    this.emp_id = emp_id;

  }

  editEmp(emp_id: any, empName: any, empPhone: any, empAltPhone: any, empEmail: any, empAddr: any, empDateOfJoin: any) {
    this.emp_id = emp_id;
    this.empName = empName;
    this.empPhone = empPhone;
    this.empAltPhone = empAltPhone;
    this.empEmail = empEmail;
    this.empAddr = empAddr;
    this.empDateOfJoin = this.common.convertOnlyDate(empDateOfJoin);
  }
  deleteEmployee() {
    const data = {
      id: this.emp_id,
      table_name: "employee",
      table_pId: "emp_id",
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.delete(data).subscribe((res: any) => {
      if (res.success) {
        this.emp_id = 0;
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.getSomeEmployee(0);
        this.getAllEmployee();
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }

  //-------------------- Freelancer Edit Delete -------------------//

  removeFreelancer(freelancerId: any) {
    this.freelancerId = freelancerId;

  }

  editFreelancer(freelancerId: any, freelancerName: any, freelancerPhone: any, freelancerEmail: any, freelancerAddr: any, freelancerDateOfJoin: any) {
    this.freelancerId = freelancerId;
    this.freelancerName = freelancerName;
    this.freelancerPhone = freelancerPhone;
    this.freelancerEmail = freelancerEmail;
    this.freelancerAddr = freelancerAddr;
    this.freelancerDateOfJoin = this.common.convertOnlyDate(freelancerDateOfJoin);
  }
  deleteFreelancer() {
    const data = {
      id: this.freelancerId,
      table_name: "freelancer",
      table_pId: "freelancerId",
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.delete(data).subscribe((res: any) => {
      if (res.success) {
        this.freelancerId = 0;
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.getSomeFreelancer(0);
        this.getAllFreelancer();
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }

  search(type: any) {
    if (type == 0) {
      if (this.search_emp_id == "" || this.search_emp_id == null || this.search_emp_id == undefined) {
        this.common.showAlertMessage("Please select employee", this.common.errContent);
        return;
      }
      this.getSomeEmployee(1);
    } else {
      if (this.search_freelancerId == "" || this.search_freelancerId == null || this.search_freelancerId == undefined) {
        this.common.showAlertMessage("Please select freelancer", this.common.errContent);
        return;
      }
      this.getSomeFreelancer(1);
    }
  }
  searchClear(type: any) {
    if (type == 0) {
      this.search_emp_id = 0;
      this.getSomeEmployee(0);
    } else {
      this.search_freelancerId = 0;
      this.getSomeFreelancer(0);
    }
  }

  clear() {
    this.emp_id = 0;
    this.empName = "";
    this.empPhone = "";
    this.empAddr = "";
    this.empEmail = "";
    this.empDateOfJoin = "";
  }

  //---------------------------- Employee Attendance ----------------------------//

  getAllEmployee() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getEmployeeList(data).subscribe((res: any) => {
      if (res.success) {
        this.empAttnArrar = [];
        this.allEmployeeList = [];
        this.allEmployeeList = res.response;
        // this.empAttnArrar = [];
        for (let item of this.allEmployeeList) {
          this.empAttnArrar.push({ "emp_id": item.emp_id, "emp_attn_name": item.empName, "emp_attendance": "", "emp_outdoor_hrs": "", "empRemarks": "" });
        }
      }
    })
  }

  getAllFreelancer() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getFreelancerList(data).subscribe((res: any) => {
      if (res.success) {
        this.allFreelancerList = [];
        this.allFreelancerList = res.response;
      }
    })
  }

  clearSearch() {
    this.selectYear = this.year;
    this.selectcurrentMonthNo = this.currentMonthNo;
    this.emp_id_for_attn = 0;
    this.getEmployeeAttendanceList();
  }
  empAttnSearch() {
    this.getEmployeeAttendanceList();
  }

  employeeAttendanceSubmit() {
    if (this.attnDate == "" || this.attnDate == null || this.attnDate == undefined) {
      this.common.showAlertMessage("Please choose attendance date", this.common.errContent);
      return;
    }
    // for (let item of this.empAttnArrar) {
    //   if (item.emp_attendance == "" || item.emp_attendance == null || item.emp_attendance == undefined) {
    //     this.common.showAlertMessage("Please select attendance", this.common.errContent);
    //     return;
    //   }
    // }
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      attnDate: this.attnDate,
      empAttnArrar: this.empAttnArrar,
      empAttn_id: this.empAttn_id
    };
    console.log("empAttnArr>>>",data.empAttnArrar);
    console.log("empAttn_id>>>",data.empAttn_id);
    this.rest.employeeAttendance(data).subscribe((res: any) => {
      if (res.success) {
        this.empAttnArrar = [];
        this.getAllEmployee();
        this.getEmployeeAttendanceList();
        this.common.showAlertMessage(res.message, this.common.succContent);
      }
    })
  }

  empAttnClear() {
  }

  getEmployeeAttendanceList() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      emp_id: this.emp_id_for_attn,
      year: this.selectYear,
      month: this.selectcurrentMonthNo
    };
    this.rest.getEmployeeAttendanceList(data).subscribe((res: any) => {
      if (res.success) {
        this.employeeAttendanceList = [];
        this.employeeAttendanceList = res.response;
        //this.empAttnTotal = res.totalCount;
      }
    })
  }

  // empDetils() {
  //   var empDetail = this.getEmployeeDetailsById(this.emp_attn_name);
  // }

  // getEmployeeDetailsById(emp_id: any) {
  //   return this.allEmployeeList.find((emp: any) => emp.emp_id == emp_id);
  // }


  removeEmpAttendance(empAttn_id: any) {
    this.empAttn_id = empAttn_id;
  }
  editEmpAttendance(empAttn_id: any, empName: any, emp_id: any, empEntryTime: any, emp_attendance: any, emp_outdoor_hrs: any, empRemarks: any) {
    this.editFlag = true;
    this.editForEmpName = empName;
    this.emp_id = emp_id;
    this.openEditAttnModal()
  }
  deleteEmpAttendance() {
    const data = {
      id: this.empAttn_id,
      table_name: "employee_attendance",
      table_pId: "empAttn_id",
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.delete(data).subscribe((res: any) => {
      if (res.success) {
        this.empAttn_id = 0;
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.getEmployeeAttendanceList();
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }

  changePageLimitEmpAttn(event: any) {
    this.employeeAttnlimit = Number(event.target.value);
    this.getEmployeeAttendanceList();
  }
  changePageLimitEmp(event: any, type: any) {
    if (type == 0) {
      this.employeelimit = Number(event.target.value);
      this.getSomeEmployee(0);
    } else {
      this.freelancerlimit = Number(event.target.value);
      this.getSomeFreelancer(0);
    }
  }

  empNext(type: any) {
    var middleX = window.innerWidth / 2;
    var middleY = window.innerHeight / 2;
    window.scrollTo(middleX, middleY);
    if (type == 0) {
      this.employeeoffset = this.employeeoffset + this.employeelimit;
      this.getSomeEmployee(0);
    } else {
      this.freelanceroffset = this.freelanceroffset + this.freelancerlimit;
      this.getSomeFreelancer(0);
    }

  }
  empPrevious(type: any) {
    if (type == 0) {
      this.employeeoffset = this.employeeoffset > 0 ? this.employeeoffset - this.employeelimit : 0;
      this.getSomeEmployee(0);
    } else {
      this.freelanceroffset = this.freelanceroffset > 0 ? this.freelanceroffset - this.freelancerlimit : 0;
      this.getSomeFreelancer(0);
    }

  }

  empAttnNext() {
    var middleX = window.innerWidth / 2;
    var middleY = window.innerHeight / 2;
    window.scrollTo(middleX, middleY);
    this.employeeAttnoffset = this.employeeAttnoffset + this.employeeAttnlimit;
    this.getEmployeeAttendanceList();
  }
  empAttnPrevious() {
    this.employeeAttnoffset = this.employeeAttnoffset > 0 ? this.employeeAttnoffset - this.employeeAttnlimit : 0;
    this.getEmployeeAttendanceList();
  }

  // dateFormat(date: any) {
  //   var myDate = new Date(date);
  //   var finalDate = myDate.toISOString().split("T")[0]
  //   const [year, month, day] = finalDate.split('-');
  //   const result = [year, month, day].join('-');
  //   return result;
  // }


  //--------------------- Get Days Of A months -------------------//

  getDaysInMonth(year: number, month: number) {
    const numDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }
  getMonthName(monthValue: string): any {
    const month = this.monthList.find((month: any) => month.value === monthValue.toString());
    this.monthName = month ? month.name : '';
    return this.monthName;
  }

  getLastDateOfMonth(year: number, month: number): number {
    const numDays = new Date(year, month + 1, 0).getDate();
    return numDays;
  }

  getAttendanceForDay(employee: any, day: number) {
    const formattedDay = day < 10 ? '0' + day : day;
    const attnDates = employee.empEntryTime.split(',');
    const attendanceData = employee.emp_attendance.split(',');
    for (let i = 0; i < attnDates.length; i++) {
      const entryTimeDay = attnDates[i].split('-')[0];
      if (entryTimeDay == formattedDay) {
        return attendanceData[i] ? attendanceData[i] : 'X';
      }
    }
    return 'X';
  }

  getAttendanceOutDoorHours(employee: any, day: number) {
    const formattedDay = day < 10 ? '0' + day : day;
    const attnDates = employee.empEntryTime.split(',');
    const outdoorHoursData = employee.emp_outdoor_hrs.split(',');
    for (let i = 0; i < attnDates.length; i++) {
      const entryTimeDay = attnDates[i].split('-')[0];
      if (entryTimeDay == formattedDay) {
        return outdoorHoursData[i] ? outdoorHoursData[i] : 'X';
      }
    }
    return 'X';
  }

  openEditAttnModal() {
    this.dialogRef = this.dialog.open(this.editAttnModal, {
      width: '810px'
    })
  }

  closeEditAttnModal() {
    if(this.dialogRef) {
      this.dialogRef.close();
    }
  }
  
  getEmpAttendanceByDate() {
    const data = {
      attnDate: this.attnDate,
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      emp_id: this.emp_id
    }
    
    this.rest.getemployeeAttendanceByDate(data).subscribe((res: any) => {
      if(res.success) {
        this.empAttendance = res.response[0].emp_attendance;
        this.empOutdoorHours = res.response[0].emp_outdoor_hrs;
        this.empRemarks = res.response[0].empRemarks;
      }
    })
  }

  employeeAttendanceEdit() {
    if (this.attnDate == "" || this.attnDate == null || this.attnDate == undefined) {
      this.common.showAlertMessage("Please choose attendance date", this.common.errContent);
      return;
    }
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      emp_id: this.emp_id,
      attnDate: this.attnDate,
      empRemarks: this.empRemarks,
      empOutdoorHours: this.empOutdoorHours,
      empAttendance: this.empAttendance
    };
    this.rest.employeeAttendance(data).subscribe((res: any) => {
      if (res.success) {
        this.empAttnArrar = [];
        this.getAllEmployee();
        this.getEmployeeAttendanceList();
        this.closeEditAttnModal();
        this.common.showAlertMessage(res.message, this.common.succContent);
      }
    })
  }
}
