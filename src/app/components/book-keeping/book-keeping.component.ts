import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { RestService } from 'src/app/services/rest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-keeping',
  templateUrl: './book-keeping.component.html',
  styleUrls: ['./book-keeping.component.css']
})
export class BookKeepingComponent {
  //---------------- Record keeping-------------------//
  todayDate = new Date().toISOString().split('T')[0];
  b_id = 0;
  index = "" as any;
  book_date = this.todayDate;
  opening_date = "";
  b_description = "";
  debit_amount = 0.00;
  debit_mode = "" as any;
  credit_amount = 0.00;
  credit_mode = "" as any;
  closing_balance = 0.00;
  opening_balance = 0.00;
  actual_opening_balance = 0.00;
  remarks = "";
  bookkeepingLimit = 10;
  bookkeepingOffset = 0;
  bookkeepingList: any = [];
  userType = "" as any;
  startDate = "";
  endDate = this.todayDate;
  totalCount = 0;
  pageList = this.common.pageList;
  entryCriteria: any = ''
  recordSubmitButtonDisabled: boolean = false
  openingBalSubmitDisabled: boolean = false
  constructor(private rest: RestService, private router: Router, private location: Location, private common: CommonService, private activateRoute: ActivatedRoute) {
    this.userType = localStorage.getItem('slUserType');
  }

  ngOnInit() {
    this.getAllBookKeeping();
   
  }
  //----------------------------Record Keeping------------

  getAllBookKeeping() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      limit: this.bookkeepingLimit,
      offset: this.bookkeepingOffset,
      startDate: this.startDate,
      endDate: this.endDate,
      searchCriteria: this.entryCriteria
    };
    this.rest.getAllBookKeeping(data).subscribe((res: any) => {
      if (res.success) {
        this.bookkeepingList = [];
        this.bookkeepingList = res.response;
        this.totalCount = res.totalCount;
        if (res.actual_opening_balance) {
          this.actual_opening_balance = res.actual_opening_balance;
          this.closing_balance = this.actual_opening_balance;
        } else {
          this.actual_opening_balance = 0.00;
          this.closing_balance = 0.00;
        }
      }
    })
  }

  recordSubmit() {
    if (this.actual_opening_balance <= 0) {
      this.common.showAlertMessage("Please enter first opening balance", this.common.errContent);
      return;
    }
    if (this.book_date == "" || this.book_date == null || this.book_date == undefined) {
      this.common.showAlertMessage("Please choose date", this.common.errContent);
      return;
    }
    if (this.b_description == "" || this.b_description == null || this.b_description == undefined) {
      this.common.showAlertMessage("Please enter description", this.common.errContent);
      return;
    }

    // if (this.credit_amount == "" || this.credit_amount == null || this.credit_amount == undefined) {
    //   this.common.showAlertMessage("Please enter credit amount", this.common.errContent);
    //   return;
    // }

    if (this.credit_amount) {
      if (this.common.amountFormat(this.credit_amount) == false) {
        this.common.showAlertMessage("Please enter valid credit amount", this.common.errContent);
      }
    }
    if (this.credit_amount > 0) {
      if (this.credit_mode == "" || this.credit_mode == null || this.credit_mode == undefined) {
        this.common.showAlertMessage("Please select credit mode", this.common.errContent);
        return;
      }
    }

    // if (this.debit_amount == "" || this.debit_amount == null || this.debit_amount == undefined) {
    //   this.common.showAlertMessage("Please enter debit amount", this.common.errContent);
    //   return;
    // }

    if (this.debit_amount) {
      if (this.common.amountFormat(this.debit_amount) == false) {
        this.common.showAlertMessage("Please enter valid debit amount", this.common.errContent);
      }
    }

    if (this.debit_amount > 0) {
      if (this.debit_mode == "" || this.debit_mode == null || this.debit_mode == undefined) {
        this.common.showAlertMessage("Please select debit mode", this.common.errContent);
        return;
      }
    }

    if (this.credit_amount == 0 && this.debit_amount == 0) {
      this.common.showAlertMessage("Please enter credit amount or debit amount", this.common.errContent);
      return;
    }

    var current_balance = Number(this.actual_opening_balance) + Number(this.credit_amount);

    if (Number(current_balance) < Number(this.debit_amount)) {
      this.common.showAlertMessage("Insufficient fund", this.common.errContent);
      return;
    }

    // if (this.credit_amount == "" && this.credit_amount == null || this.credit_amount == undefined || this.credit_amount <= 0 && this.debit_amount == "" || this.debit_amount == null || this.debit_amount == undefined || this.debit_amount <= 0) {
    //   this.common.showAlertMessage("Please enter credit amount or debit amount", this.common.errContent);
    //   return;
    // }

    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      b_id: this.b_id,
      book_date: this.book_date,
      b_description: this.b_description,
      debit_amount: this.debit_amount ? this.debit_amount : 0.00,
      debit_mode: this.debit_mode,
      credit_amount: this.credit_amount ? this.credit_amount : 0.00,
      credit_mode: this.credit_mode,
      closing_balance: this.closing_balance,
      remarks: this.remarks
    };
    this.recordSubmitButtonDisabled = true
    this.rest.bookKeeping(data).subscribe((res: any) => {
      if (res.success) {
        this.getAllBookKeeping();
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.b_id = 0;
        this.book_date = this.todayDate;
        this.b_description = "";
        this.credit_amount = 0.00;
        this.credit_mode = "";
        this.debit_amount = 0.00;
        this.debit_mode = "";
        this.remarks = "";
        this.recordSubmitButtonDisabled = false;
      } else {
        this.recordSubmitButtonDisabled = false;
      }
    })
  }
  openingBalanceSubmit() {
    if (this.opening_date == "" || this.opening_date == null || this.opening_date == undefined) {
      this.common.showAlertMessage("Please choose opening date", this.common.errContent);
      return;
    };
    if (this.opening_balance == 0) {
      this.common.showAlertMessage("Please enter valid opening balance", this.common.errContent);
      return;
    };
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      b_id: this.b_id,
      book_date: this.opening_date,
      b_description: this.b_description ? this.b_description : "Opening Balance",
      debit_amount: this.debit_amount ? this.debit_amount : 0.00,
      debit_mode: this.debit_mode,
      credit_amount: this.credit_amount ? this.credit_amount : 0.00,
      credit_mode: this.credit_mode,
      closing_balance: this.opening_balance,
      remarks: this.remarks
    };
    this.openingBalSubmitDisabled = true;
    this.rest.bookKeeping(data).subscribe((res: any) => {
      if (res.success) {
        this.getAllBookKeeping();
        this.opening_balance = 0.00;
        this.opening_date = "";
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.openingBalSubmitDisabled = false;
      } else {
        this.openingBalSubmitDisabled = false;
      }
    })
  }
  calculateBalance() {
    if (!this.credit_amount) {
      this.credit_mode = "";
    }
    if (!this.debit_amount) {
      this.debit_mode = "";
    }
    this.closing_balance = (Number(this.actual_opening_balance) + Number(this.credit_amount)) - Number(this.debit_amount);
  }

  removeBookkeeping(b_id: any, index: any) {
    this.b_id = b_id;
    this.index = index;
  }
  editBookkeeping(b_id: any, book_date: any, b_description: any, opening_balance: any, credit_amount: any, credit_mode: any, debit_amount: any, debit_mode: any, closing_balance: any, remarks: any) {
    this.b_id = b_id;
    this.book_date = this.newDateFormat(book_date);
    this.b_description = b_description;
    this.credit_amount = credit_amount;
    this.credit_mode = credit_mode;
    this.debit_amount = debit_amount;
    this.debit_mode = debit_mode;
    this.actual_opening_balance = opening_balance;
    this.calculateBalance();
    this.remarks = remarks;
  }
  deleteBookkeeping() {
    if (this.bookkeepingList.length > 1 && this.index == 0) {
      this.common.showAlertMessage("First opening balance can not be deleted", this.common.errContent);
      return;
    }
    const data = {
      id: this.b_id,
      table_name: "book_keeping",
      table_pId: "b_id",
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType')
    };
    this.rest.delete(data).subscribe((res: any) => {
      if (res.success) {
        this.b_id = 0;
        this.getAllBookKeeping();
        this.common.showAlertMessage(res.message, this.common.succContent);
      } else {
        this.common.showAlertMessage(res.message, this.common.errContent);
      }
    })
  }
  //--------------------- search-------------//

  search() {
    if (this.startDate == "" || this.startDate == null || this.startDate == undefined) {
      this.common.showAlertMessage("Please choose from date", this.common.errContent);
      return;
    }
    if (this.endDate == "" || this.endDate == null || this.endDate == undefined) {
      this.common.showAlertMessage("Please choose to date", this.common.errContent);
      return;
    }
    if (this.endDate < this.startDate) {
      this.common.showAlertMessage("Please choose valid date range", this.common.errContent);
      return;
    }
    this.getAllBookKeeping();
  }
  clear() {
    this.startDate = "";
    this.endDate = this.todayDate;
    this.getAllBookKeeping();
  }

  //----------------------- Previous Next ---------------------//

  changePageLimit(event: any) {
    this.bookkeepingLimit = Number(event.target.value);
    this.getAllBookKeeping();
  }
  next() {
    var middleX = window.innerWidth / 2;
    var middleY = window.innerHeight / 2;
    window.scrollTo(middleX, middleY);
    this.bookkeepingOffset = this.bookkeepingOffset + this.bookkeepingLimit;
    this.getAllBookKeeping();
  }
  previous() {
    this.bookkeepingOffset = this.bookkeepingOffset > 0 ? this.bookkeepingOffset - this.bookkeepingLimit : 0;
    this.getAllBookKeeping();
  }


  newDateFormat(date: any) {
    var genDate: any = new Date(date).toISOString().split('T')[0];
    return genDate;
  }

  bookKeepingReport() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      limit: this.bookkeepingLimit,
      offset: this.bookkeepingOffset,
      startDate: this.startDate,
      endDate: this.endDate
    }
    this.rest.getAllBookKeepingReport(data).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookkeepingreport.xlsx';
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
