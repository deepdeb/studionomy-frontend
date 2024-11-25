import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCalenderComponent } from './public-calender.component';

describe('PublicCalenderComponent', () => {
  let component: PublicCalenderComponent;
  let fixture: ComponentFixture<PublicCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicCalenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
