import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class RestService {
  API_ROOT = environment.API_ROOT;
  imagePath = environment.ImagePath;
  filePath = environment.FilePath;
  constructor(private http: HttpClient) {}

  //------------------------------ Users-----------------------------//

  login(data: any) {
    return this.http.post(this.API_ROOT + 'user/userLogin', data, httpOptions);
  }
  userUpdate(data: any) {
    return this.http.post(this.API_ROOT + 'user/userUpdate', data, httpOptions);
  }
  emailSubmitForForgot(data: any) {
    return this.http.post(
      this.API_ROOT + 'user/emailSendForForgotPassword',
      data,
      httpOptions
    );
  }
  updatePassword(data: any) {
    return this.http.post(
      this.API_ROOT + 'user/updatepassword',
      data,
      httpOptions
    );
  }
  register(data: any) {
    return this.http.post(
      this.API_ROOT + 'user/userRegistration',
      data,
      httpOptions
    );
  }
  getUserDetials(data: any) {
    return this.http.post(
      this.API_ROOT + 'user/getUserDetails',
      data,
      httpOptions
    );
  }
  getUserPublicInfo(data: any) {
    return this.http.post(
      this.API_ROOT + 'user/userPublicInfo',
      data,
      httpOptions
    );
  }
  searchUser(data: any) {
    return this.http.post(this.API_ROOT + 'user/searchUser', data, httpOptions);
  }
  shareProfile(data: any) {
    return this.http.post(
      this.API_ROOT + 'user/shareProfile',
      data,
      httpOptions
    );
  }
  getUserDetailsByEmail(data: any) {
    return this.http.post(this.API_ROOT + 'user/getuserdetailsbyemail', data)
  }
  updateOTPinDB(data: any) {
    return this.http.post(this.API_ROOT + 'user/updateOTPinDB', data)
  }
  checkAndChangePassword(data: any) {
    return this.http.post(this.API_ROOT + 'user/checkAndChangePassword', data)
  }
  //---------------------- Job ---------------------//

  createJob(data: any) {
    return this.http.post(this.API_ROOT + 'job/jobentry', data, httpOptions);
  }
  getAllJobList(data: any) {
    return this.http.post(this.API_ROOT + 'job/joblist', data, httpOptions);
  }
  jobDetails(data: any) {
    return this.http.post(this.API_ROOT + 'job/jobdetails', data, httpOptions);
  }
  paymentForJob(data: any) {
    return this.http.post(
      this.API_ROOT + 'job/paymentForJob',
      data,
      httpOptions
    );
  }

  jobNoGenerate(data: any) {
    return this.http.post(this.API_ROOT + 'job/jobNoGen', data, httpOptions);
  }

  invEmployeeBook(data: any) {
    return this.http.post(
      this.API_ROOT + 'job/invEmployeeBook',
      data,
      httpOptions
    );
  }

  getEquipmentsEmployee(data: any) {
    return this.http.post(
      this.API_ROOT + 'job/equipmentsEmployeeDetails',
      data,
      httpOptions
    );
  }

  equipmentTableRemove(data: any) {
    return this.http.post(
      this.API_ROOT + 'job/equipmentTableRemove',
      data,
      httpOptions
    );
  }

  getAllJobBookKeeping(data: any) {
    return this.http.post(
      this.API_ROOT + 'job/jobbookkeepingList',
      data,
      httpOptions
    );
  }

  expenseForJob(data: any) {
    return this.http.post(
      this.API_ROOT + 'job/expenseForJob',
      data,
      httpOptions
    );
  }

  //------------------------ Subscription -----------------------//

  getSubscriptionList(data: any) {
    return this.http.post(
      this.API_ROOT + 'subscription/subscriptionsList',
      data,
      httpOptions
    );
  }
  getAllBuySubscriptionList(data: any) {
    return this.http.post(
      this.API_ROOT + 'subscription/buysubscriptionlist',
      data,
      httpOptions
    );
  }
  setSubscriptionActiveStatus() {
    return this.http.get(
      this.API_ROOT + 'subscription/setSubscriptionActiveStatus', httpOptions
    );
  }
  buySubscription(data: any) {
    return this.http.post(
      this.API_ROOT + 'subscription/buysubscription',
      data,
      httpOptions
    )
  }
  createOrder(data: any) {
    return this.http.post(
      this.API_ROOT + 'subscription/createorder',
      data,
      httpOptions
    )
  }
  verifyPayment(data: any) {
    return this.http.post(
      this.API_ROOT + 'subscription/verifypayment',
      data,
      httpOptions
    )
  }
  initiatePayment(data: any) {
    return this.http.post(
      this.API_ROOT + 'subscription/initiatepayment',
      data,
      httpOptions
    )
  }
  //-------------------- Query ------------------------//

  submitQuery(data: any) {
    return this.http.post(this.API_ROOT + 'query/addQuery', data, httpOptions);
  }

  //------------------------- Feedback ----------------------//

  submitFeedback(data: any) {
    return this.http.post(
      this.API_ROOT + 'feedback/addFeedback',
      data,
      httpOptions
    );
  }
  getFeedbackList() {
    return this.http.get(
      this.API_ROOT + 'feedback/approvedFeedbackList',
      httpOptions
    );
  }

  //-----------------Inventory ------------------//

  inventorysubmit(data: any) {
    return this.http.post(
      this.API_ROOT + 'inventory/inventorysubmit',
      data,
      httpOptions
    );
  }
  getInventoryList(data: any) {
    return this.http.post(
      this.API_ROOT + 'inventory/inventoryList',
      data,
      httpOptions
    );
  }
  getEquipmentList(data: any) {
    return this.http.post(
      this.API_ROOT + 'inventory/equipmentList',
      data,
      httpOptions
    );
  }

  getEquipmentListForBook(data: any) {
    return this.http.post(this.API_ROOT + 'inventory/equipmentListForBook', data, httpOptions);
  }

  getEquipmentPublicInfo(data: any) {
    return this.http.post(
      this.API_ROOT + 'inventory/equipmentPublicInfo',
      data,
      httpOptions
    );
  }

  //----------------------- Employee-----------------//

  submitEmployee(data: any) {
    return this.http.post(
      this.API_ROOT + 'employee/employeeSubmit',
      data,
      httpOptions
    );
  }
  getEmployeeList(data: any) {
    return this.http.post(
      this.API_ROOT + 'employee/employeeList',
      data,
      httpOptions
    );
  }

  //--------------------- Freelancer----------------------//

  submitFreelancer(data: any) {
    return this.http.post(
      this.API_ROOT + 'freelancer/freelancerSubmit',
      data,
      httpOptions
    );
  }
  getFreelancerList(data: any) {
    return this.http.post(
      this.API_ROOT + 'freelancer/freelancerList',
      data,
      httpOptions
    );
  }

  getAllFreelancerRequest(data: any) {
    return this.http.post(
      this.API_ROOT + 'freelancer/freelancerRequest',
      data,
      httpOptions
    )
  }

  acceptPayment(data: any) {
    return this.http.post(this.API_ROOT + 'freelancer/acceptPayment', data, httpOptions)
  }

  rejectPayment(data: any) {
    return this.http.post(this.API_ROOT + 'freelancer/rejectPayment', data, httpOptions)
  }

  getFreelancerEOPaymentByJob(data: any) {
    return this.http.post(this.API_ROOT + 'freelancer/freelancerEOPaymentByJob', data, httpOptions)
  }

  submitPayment(data: any) {
    return this.http.post(this.API_ROOT + 'freelancer/submitPayment', data, httpOptions)
  }
  //------------------------------- Employee Attendance -------------------//

  employeeAttendance(data: any) {
    return this.http.post(
      this.API_ROOT + 'employee/employeeAttendance',
      data,
      httpOptions
    );
  }
  getEmployeeAttendanceList(data: any) {
    return this.http.post(
      this.API_ROOT + 'employee/employeeAttendanceList',
      data,
      httpOptions
    );
  }
  getemployeeAttendanceByDate(data: any) {
    return this.http.post(
      this.API_ROOT + 'employee/employeeAttendanceByDate',
      data,
      httpOptions
    );
  }
  //------------------------ Book Keeping---------------------//

  getAllBookKeeping(data: any) {
    // if(data.searchCriteria) {
    //   return this.http.post(this.API_ROOT + 'bookkeeping/bookkeepingSearch', data, httpOptions);
    // } else {
      return this.http.post( this.API_ROOT + 'bookkeeping/bookkeepingList', data, httpOptions );
    // }
  }

  bookKeeping(data: any) {
    return this.http.post(
      this.API_ROOT + 'bookkeeping/bookkeepingSubmit',
      data,
      httpOptions
    );
  }

  //---------------------------------- Network ----------------------//

  searchForNetwork(data: any) {
    return this.http.post(
      this.API_ROOT + 'network/searchForNetwork',
      data,
      httpOptions
    );
  }
  addToMyNetwork(data: any) {
    return this.http.post(
      this.API_ROOT + 'network/addToMyNetwork',
      data,
      httpOptions
    );
  }
  getMyNetworkList(data: any) {
    return this.http.post(
      this.API_ROOT + 'network/myNetworks',
      data,
      httpOptions
    );
  }
  sendRequestForFL(data: any) {
    return this.http.post(
      this.API_ROOT + 'network/sendRequest',
      data,
      httpOptions
    );
  }
  sendRequestForEO(data: any) {
    return this.http.post(this.API_ROOT + 'network/sendRequestForEO', data, httpOptions);
  }
  deleteRequest(data: any) {
    return this.http.post(
      this.API_ROOT + 'network/deleteRequest',
      data,
      httpOptions
    );
  }
  getAllRequestBookingList(data: any) {
    return this.http.post(
      this.API_ROOT + 'network/requestBookingList',
      data,
      httpOptions
    );
  }
  getAllMyReqBookingList(data: any) {
    return this.http.post(
      this.API_ROOT + 'network/myReqBookingList',
      data,
      httpOptions
    );
  }
  updateRequest(data: any) {
    return this.http.post(
      this.API_ROOT + 'network/updateRequest',
      data,
      httpOptions
    );
  }
  getBookingStatusByDates(data: any) {
    return this.http.post(
      this.API_ROOT + 'network/bookingStatusByDates',
      data,
      httpOptions
    );
  }
  getSelectedDatesForFLBook(data: any) {
    return this.http.post(this.API_ROOT + 'network/selectedDatesForFLBook', data, httpOptions);
  }
  getSelectedEquipmentsForEOBook(data: any) {
    return this.http.post(this.API_ROOT + 'network/selectedEquipmentsForEOBook', data, httpOptions);
  }
  //----------------------------------//

  //------------------------ Common -------------------//

  getCityList(data: any) {
    return this.http.post(
      'https://countriesnow.space/api/v0.1/countries/state/cities',
      data
    );
  }
  getStateList() {
    return this.http.get(this.API_ROOT + 'common/stateList', httpOptions);
  }
  getAllEquipmentCategory() {
    return this.http.get(
      this.API_ROOT + 'common/equipmentCategoryList',
      httpOptions
    );
  }
  getEquipmentSubCategoryList(data: any) {
    return this.http.post(
      this.API_ROOT + 'common/equipmentSubCategoryList',
      data,
      httpOptions
    );
  }
  getAllBrand() {
    return this.http.get(this.API_ROOT + 'common/brandList', httpOptions);
  }
  uploadFile(data: any) {
    return this.http.post(this.API_ROOT + 'common/fileupload', data);
  }
  uploadImage(data: any) {
    return this.http.post(this.API_ROOT + 'common/imageupload', data);
  }
  delete(data: any) {
    return this.http.post(this.API_ROOT + 'common/delete', data, httpOptions);
  }
  sendMail(data: any) {
    return this.http.post(this.API_ROOT + 'common/sendmail', data);
  }
  //------------------------------------- Get Quote -------------------------//

  createQuote(data: any) {
    return this.http.post(this.API_ROOT + 'common/quotationentry', data);
  }

  getAllQuoteList(data: any) {
    return this.http.post(this.API_ROOT + 'common/quotationlist', data);
  }

  generatequotationPdf(data: any, httpOptionsPdf: any) {
    return this.http.post(
      this.API_ROOT + 'common/quotationPdf',
      data,
      httpOptionsPdf
    );
  }

  quoteNoGenerate(data: any) {
    return this.http.post(
      this.API_ROOT + 'common/quoteNoGen',
      data,
      httpOptions
    );
  }

  getQuoteByQuoteNum(data: any) {
    return this.http.post(this.API_ROOT + 'common/quotationbyquotenum', data)
  }

  // job list report
  getAllJobListReport(data: any): Observable<any> {
    const options = { responseType: 'blob' as 'json' };
    return this.http.post(this.API_ROOT + 'job/joblistReport', data, options);
  }

  // quote list report
  getAllQuoteListReport(data: any): Observable<any> {
    const options = { responseType: 'blob' as 'json'};
    return this.http.post(this.API_ROOT + 'common/quotationReport', data, options);
  }

  // employee attendance report
  getAllEmployeeAttendanceListReport(data: any): Observable<any> {
    const options = { responseType: 'blob' as 'json'};
    return this.http.post(this.API_ROOT + 'employee/employeeAttendanceListReport', data, options);
  }

  // employee list report
  getAllEmployeeListReport(data: any): Observable<any> {
    const options = { responseType: 'blob' as 'json'};
    return this.http.post(this.API_ROOT + 'employee/employeeListReport', data, options);
  }

  // inventory list report
  getAllInventoryListReport(data: any): Observable<any> {
    const options = { responseType: 'blob' as 'json'};
    return this.http.post(this.API_ROOT + 'inventory/inventoryListReport', data, options);
  }

  // equipment for rent list report
  getAllEquipmentForRentListReport(data: any): Observable<any> {
    const options = { responseType: 'blob' as 'json'};
    return this.http.post(this.API_ROOT + 'inventory/equipmentForRentListReport', data, options);
  }

  // book keeping list report
  getAllBookKeepingReport(data: any): Observable<any> {
    const options = { responseType: 'blob' as 'json' };
    return this.http.post(this.API_ROOT + 'bookkeeping/bookkeepingListReport', data, options);
  }

  // job ledger report
  getAllJobLedgerReport(data: any): Observable<any> {
    const options = { responseType: 'blob' as 'json' };
    return this.http.post(this.API_ROOT + 'job/jobbookkeepingListReport', data, options);
  }
}
