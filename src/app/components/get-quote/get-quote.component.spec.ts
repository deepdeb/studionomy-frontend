import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetQuoteComponent } from './get-quote.component';

describe('GetQuoteComponent', () => {
  let component: GetQuoteComponent;
  let fixture: ComponentFixture<GetQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetQuoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
