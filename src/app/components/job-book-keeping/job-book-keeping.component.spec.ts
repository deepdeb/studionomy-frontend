import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBookKeepingComponent } from './job-book-keeping.component';

describe('JobBookKeepingComponent', () => {
  let component: JobBookKeepingComponent;
  let fixture: ComponentFixture<JobBookKeepingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobBookKeepingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobBookKeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
