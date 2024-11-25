import { Component } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  startDate: any;
  endDate: any;

  constructor(private rest: RestService, private common: CommonService) { }

  jobReport() {
    if (!this.startDate) {
      this.common.showAlertMessage('Select start date', this.common.errContent);
      return
    }
    if (!this.endDate) {
      this.common.showAlertMessage('Select end date,', this.common.errContent);
      return
    }
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
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

  quotationReport() {
    if (!this.startDate) {
      this.common.showAlertMessage('Select start date', this.common.errContent);
      return
    }
    if (!this.endDate) {
      this.common.showAlertMessage('Select end date,', this.common.errContent);
      return
    }
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      start_date: this.startDate,
      end_date: this.endDate
    };
    this.rest.getAllQuoteListReport(data).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quotationreport.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      // Handle error
      console.error('Error:', error);
    });
  }

  employeeAttendanceReport() {
    if (!this.startDate) {
      this.common.showAlertMessage('Select start date', this.common.errContent);
      return
    }
    if (!this.endDate) {
      this.common.showAlertMessage('Select end date,', this.common.errContent);
      return
    }
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      start_date: this.startDate,
      end_date: this.endDate
    };
    this.rest.getAllEmployeeAttendanceListReport(data).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employee_attendance_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      // Handle error
      console.error('Error:', error);
    });
  }

  employeeListReport() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getAllEmployeeListReport(data).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employee_list_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      // Handle error
      console.error('Error:', error);
    });
  }

  inventoryListReport() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getAllInventoryListReport(data).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory_list_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      // Handle error
      console.error('Error:', error);
    });
  }

  equipmentForRentReport() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.getAllEquipmentForRentListReport(data).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'equipment_for_rent_list_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      // Handle error
      console.error('Error:', error);
    });
  }

  bookkeepingReport() {
    if (!this.startDate) {
      this.common.showAlertMessage('Select start date', this.common.errContent);
      return
    }
    if (!this.endDate) {
      this.common.showAlertMessage('Select end date,', this.common.errContent);
      return
    }
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      start_date: this.startDate,
      end_date: this.endDate
    };
    this.rest.getAllBookKeepingReport(data).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookkeeping_list_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      // Handle error
      console.error('Error:', error);
    });
  }

  jobLedgerReport() {
    if (!this.startDate) {
      this.common.showAlertMessage('Select start date', this.common.errContent);
      return
    }
    if (!this.endDate) {
      this.common.showAlertMessage('Select end date,', this.common.errContent);
      return
    }
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      start_date: this.startDate,
      end_date: this.endDate
    };
    this.rest.getAllJobLedgerReport(data).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'job_ledger_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      // Handle error
      console.error('Error:', error);
    });
  }

}
