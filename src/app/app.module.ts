import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { JobComponent } from './components/job/job.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { QueryComponent } from './components/query/query.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { BookKeepingComponent } from './components/book-keeping/book-keeping.component';
import { AuthInterceptor } from './security/auth.interceptor';
import { CalenderComponent } from './components/calender/calender.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarContentComponent } from './components/calendar-content/calendar-content.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GetQuoteComponent } from './components/get-quote/get-quote.component';
import { QuotationComponent } from './components/quotation/quotation.component';
import { NetworkComponent } from './components/network/network.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { CommonHeaderComponent } from './components/common-header/common-header.component';
import { PublicCalenderComponent } from './components/public-calender/public-calender.component';
import { RequestForBookingComponent } from './components/request-for-booking/request-for-booking.component';
import { BookingCalenderComponent } from './components/booking-calender/booking-calender.component';
import { JobBookKeepingComponent } from './components/job-book-keeping/job-book-keeping.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentFailureComponent } from './components/payment-failure/payment-failure.component';
import { ReportsComponent } from './components/reports/reports.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutUsComponent,
    JobComponent,
    RegisterComponent,
    ProfileComponent,
    FooterComponent,
    SubscriptionComponent,
    FeedbackComponent,
    QueryComponent,
    LoginComponent,
    ForgotPasswordComponent,
    UserDetailsComponent,
    UserUpdateComponent,
    InventoryComponent,
    EmployeeComponent,
    BookKeepingComponent,
    CalenderComponent,
    CalendarContentComponent,
    GetQuoteComponent,
    QuotationComponent,
    NetworkComponent,
    PaymentDetailsComponent,
    CommonHeaderComponent,
    PublicCalenderComponent,
    RequestForBookingComponent,
    BookingCalenderComponent,
    JobBookKeepingComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    DisclaimerComponent,
    RefundPolicyComponent,
    ContactUsComponent,
    SpinnerComponent,
    PaymentSuccessComponent,
    PaymentFailureComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    CarouselModule,
    MatSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    FullCalendarModule,
    MatDialogModule
  ],
  exports: [HeaderComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
