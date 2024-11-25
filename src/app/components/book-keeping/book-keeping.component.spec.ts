import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookKeepingComponent } from './book-keeping.component';

describe('BookKeepingComponent', () => {
  let component: BookKeepingComponent;
  let fixture: ComponentFixture<BookKeepingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookKeepingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookKeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
