import { Component } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Router,ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms'

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})


export class PaymentDetailsComponent {

  userType = "" as any;
  job_id = "" as any;
  job_number = "" as any;
  job_value = "";
  custName = "";
  phoneNo = "";
  altPhoneNo = "";
  totalAmount: any = 0;
  job_details = '';
  payment_type = "" as any;
  today = new Date().toISOString().split("T")[0];
  payment_date = this.today;
  payment_description  = "" as any;
  due_amount = "";
  products = "";
  payment_amount = "" as any;
  //rows: FormArray;
  exp_payment_date = this.today;
  exp_payment_type = "" as any;
  exp_payment_description = "" as any;
  exp_payment_amount = "" as any;
  product_id = "" as any;
  delivery_date = "" as any;

  constructor(private common: CommonService,private router: Router ,private activateRoute: ActivatedRoute,private rest: RestService,private fb: FormBuilder) {
    this.userType = localStorage.getItem('slUserType');
    this.job_id = this.activateRoute.snapshot.paramMap.get('id');
    if (this.job_id != 0) {
      this.getJobDetailsById();
    } 


    // this.addForm = this.fb.group({
    //   items: [null, Validators.required],
    //   items_value: ['no', Validators.required]
    // });
    // this.rows = this.fb.array([]);
  }
  ngOnInit() {

  }

  payment_submit() {
    if (this.payment_date == "" || this.payment_date == null || this.payment_date == undefined) {
      this.common.showAlertMessage("Please select payment date", this.common.errContent);
      return;
    }

    if (this.payment_type == "" || this.payment_type == null || this.payment_type == undefined) {
      this.common.showAlertMessage("Please select payment type", this.common.errContent);
      return;
    }

    // if (this.payment_description == "" || this.payment_description == null || this.payment_description == undefined) {
    //   this.common.showAlertMessage("Please enter payment description", this.common.errContent);
    //   return;
    // }

    if (this.payment_amount == "" || this.payment_amount == null || this.payment_amount == undefined) {
      this.common.showAlertMessage("Please enter price value", this.common.errContent);
      return;
    }

    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      job_id :this.job_id,
      job_number: this.job_number,
      job_value: this.job_value,
      job_details: this.job_details,
      payment_date: this.payment_date,
      payment_type: this.payment_type,
      payment_description: this.payment_description,
      payment_amount: this.payment_amount ? this.payment_amount : 0,
    };

    this.rest.paymentForJob(data).subscribe((res: any) => {
      if (res.success) {
       // console.log(res.response);
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.payment_date = "";
        this.payment_type = "";
        this.payment_description = "";
        this.payment_amount = "";
      } 
    })
  }

  // get addDynamicRow() {
  //   return this.addForm.get('rows') as FormArray;
  // }
  
  // onRemoveRow(rowIndex:number){
  //   this.rows.removeAt(rowIndex);
  // }

  // createItemFormGroup(): FormGroup {
  //   return this.fb.group({
  //     name: null,
  //     description: null,
  //     qty: null
  //   });
  // }

  getJobDetailsById() {
    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      job_id: this.job_id
    };
    this.rest.jobDetails(data).subscribe((res: any) => {
      if (res.success) {
        //console.log(res.response);
        if (res.response) {
         
          this.job_number = res.response.job_number;
          this.job_details = res.response.job_details;
          this.job_value = res.response.total_amount;
          this.custName = res.response.cust_name;
          this.phoneNo = res.response.cust_phoneNo;
          this.altPhoneNo = res.response.cust_altPhoneNo;
          this.due_amount = res.response.due_amount;
          this.products = res.response.products;
        }
      }
    })
  }

  expense_submit(){
    if (this.exp_payment_date == "" || this.exp_payment_date == null || this.exp_payment_date == undefined) {
      this.common.showAlertMessage("Please select expense payment date", this.common.errContent);
      return;
    }

    if (this.exp_payment_type == "" || this.exp_payment_type == null || this.exp_payment_type == undefined) {
      this.common.showAlertMessage("Please select expense payment type", this.common.errContent);
      return;
    }

    if (this.exp_payment_description == "" || this.exp_payment_description == null || this.exp_payment_description == undefined) {
      this.common.showAlertMessage("Please enter expense payment description", this.common.errContent);
      return;
    }

    if (this.exp_payment_amount == "" || this.exp_payment_amount == null || this.exp_payment_amount == undefined) {
      this.common.showAlertMessage("Please enter expense price value", this.common.errContent);
      return;
    }

    const data = {
      userId: localStorage.getItem('slUserId'),
      userType: localStorage.getItem('slUserType'),
      job_id :this.job_id,
      job_number: this.job_number,
      job_value: this.job_value,
      job_details: this.job_details,
      exp_payment_date: this.exp_payment_date,
      exp_payment_type: this.exp_payment_type,
      exp_payment_description: this.exp_payment_description,
      exp_payment_amount: this.exp_payment_amount ? this.exp_payment_amount : 0,
    };

    this.rest.expenseForJob(data).subscribe((res: any) => {
      if (res.success) {
       // console.log(res.response);
        this.common.showAlertMessage(res.message, this.common.succContent);
        this.exp_payment_date = "";
        this.exp_payment_type = "";
        this.exp_payment_description = "";
        this.exp_payment_amount = "";
      } 
    })
  }

  saveDelivaryStatus(product_id : any){
   
    console.log(product_id);
  }
 
}
