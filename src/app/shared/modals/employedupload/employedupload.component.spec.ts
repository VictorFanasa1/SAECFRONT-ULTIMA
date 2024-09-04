import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeduploadComponent } from './employedupload.component';

describe('EmployeduploadComponent', () => {
  let component: EmployeduploadComponent;
  let fixture: ComponentFixture<EmployeduploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeduploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeduploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
