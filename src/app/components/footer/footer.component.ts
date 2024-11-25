import { Component, Renderer2 } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonService } from '../../services/common.service';
import { Route, Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  userType = '' as any;
  city = '';
  name = '';
  limit: number = 10;
  offset: number = 0;
  userList: any = [];
  userTotal = 0;
  searchErr = '';
  today = Date();
  currentURL = '' as any;

  constructor(
    private rest: RestService,
    private common: CommonService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.currentURL = this.activatedRouter.snapshot.url[0] ? this.activatedRouter.snapshot.url[0].path : '';
    // this.loadScript('https://www.freevisitorcounters.com/auth.php?id=2478f6cdd76a34284c91ecb6ae88f8bc469ad818');
    // this.loadScript('https://www.freevisitorcounters.com/en/home/counter/1236887/t/13');
  }

  search() {
    this.userList = [];
    if (this.userType == '' && this.city == '' && this.name == '') {
      this.searchErr = '***Please choose any one field';
      return;
    }
    const data = {
      userType: this.userType ? this.userType : null,
      city: this.city ? this.city : null,
      name: this.name ? this.name : null,
      limit: this.limit,
      offset: this.offset,
    };
    this.rest.searchUser(data).subscribe((res: any) => {
      this.userList = [];
      if (res.success) {
        this.userList = res.response;
        this.userTotal = res.totalUser;
      }
    });
  }

  userDetails(id: any) {
    this.router.navigate(['user-detail/' + id]);
  }
  checkSearchError() {
    if (
      this.userType != '' ||
      this.userType != null ||
      this.name != '' ||
      this.city != ''
    ) {
      this.searchErr = '';
    }
  }
  //----------------------- Previous Next ---------------------//

  changePageLimit(event: any) {
    this.limit = Number(event.target.value);
    this.search();
  }
  next() {
    this.offset = this.offset + this.limit;
    this.search();
  }
  previous() {
    this.offset = this.offset > 0 ? this.offset - this.limit : 0;
    this.search();
  }
  goToTermsAndConditions() {
    this.router.navigate(['/terms-conditions']);
    return false;
  }
  goToDisclaimer() {
    this.router.navigate(['/disclaimer']);
    return false;
  }
  goToPrivacyPolicies() {
    this.router.navigate(['/privacy-policies']);
    return false;
  }
  goToRefundPolicy() {
    this.router.navigate(['/refund-policy']);
    return false;
  }
  goToReferences() {
  }

  loadScript(src: string) {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    this.renderer.appendChild(document.body, script);
  }
}
