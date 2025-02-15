import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteTourComponent } from './website-tour.component';

describe('WebsiteTourComponent', () => {
  let component: WebsiteTourComponent;
  let fixture: ComponentFixture<WebsiteTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteTourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
