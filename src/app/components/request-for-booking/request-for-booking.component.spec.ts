import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForBookingComponent } from './request-for-booking.component';

describe('RequestForBookingComponent', () => {
  let component: RequestForBookingComponent;
  let fixture: ComponentFixture<RequestForBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestForBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
