import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { JobComponent } from './components/job/job.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { QueryComponent } from './components/query/query.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { BookKeepingComponent } from './components/book-keeping/book-keeping.component';
import { JobBookKeepingComponent } from './components/job-book-keeping/job-book-keeping.component';
import { AuthGuard } from './guards/auth.guard';
import { StudioRoleAuthGuard } from './guards/studiorole-auth.guard';
import { StudioAuthGuard } from './guards/studio-auth.guard';
import { StudioEquipmentOwnerAuthGuard } from './guards/studio-equipmentowner-auth.guard';
import { CalenderComponent } from './components/calender/calender.component';
import { GetQuoteComponent } from './components/get-quote/get-quote.component';
import { QuotationComponent } from './components/quotation/quotation.component';
import { NetworkComponent } from './components/network/network.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { PublicCalenderComponent } from './components/public-calender/public-calender.component';
import { BookingCalenderComponent } from './components/booking-calender/booking-calender.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentFailureComponent } from './components/payment-failure/payment-failure.component';
import { WebsiteTourComponent } from './components/website-tour/website-tour.component';
// import { ReportsComponent } from './components/reports/reports.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  // { path: 'register/:id', component: RegisterComponent },
  { path: 'register-studio-owner', component: RegisterComponent },
  { path: 'register-freelancer', component: RegisterComponent },
  { path: 'register-equipment-owner', component: RegisterComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'terms-conditions', component: TermsAndConditionsComponent},
  { path: 'disclaimer', component: DisclaimerComponent},
  { path: 'privacy-policies', component: PrivacyPolicyComponent},
  { path: 'refund-policy', component: RefundPolicyComponent},
  { path: 'job', component: JobComponent, canActivate: [AuthGuard, StudioRoleAuthGuard, StudioEquipmentOwnerAuthGuard] },
  { path: 'job/:id', component: JobComponent, canActivate: [AuthGuard, StudioRoleAuthGuard, StudioEquipmentOwnerAuthGuard] },
  { path: 'user', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'query', component: QueryComponent },
  { path: 'user-detail/:id', component: UserDetailsComponent },
  { path: 'user-update', component: UserUpdateComponent, canActivate: [AuthGuard, StudioRoleAuthGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard, StudioAuthGuard] },
  { path: 'book-keeping', component: BookKeepingComponent, canActivate: [AuthGuard] },
  { path: 'job-book-keeping', component: JobBookKeepingComponent, canActivate: [AuthGuard, StudioRoleAuthGuard, StudioAuthGuard] },
  { path: 'calender', component: CalenderComponent, canActivate: [AuthGuard] },
  { path: 'quote', component: GetQuoteComponent, canActivate: [AuthGuard, StudioAuthGuard] },
  { path: 'quotation', component: QuotationComponent, canActivate: [AuthGuard] },
  { path: 'network', component: NetworkComponent, canActivate: [AuthGuard] },
  // { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'payment-details/:id', component: PaymentDetailsComponent, canActivate: [AuthGuard] },
  { path: 'public-calender', component: PublicCalenderComponent, canActivate: [AuthGuard] },
  { path: 'booking-calender', component: BookingCalenderComponent, canActivate: [AuthGuard, StudioAuthGuard] },
  { path: 'payment-success', component: PaymentSuccessComponent},
  { path: 'payment-failure', component: PaymentFailureComponent },
  { path: 'website-tour', component: WebsiteTourComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
