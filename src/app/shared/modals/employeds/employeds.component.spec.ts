import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployedsComponent } from './employeds.component';

describe('EmployedsComponent', () => {
  let component: EmployedsComponent;
  let fixture: ComponentFixture<EmployedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployedsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
