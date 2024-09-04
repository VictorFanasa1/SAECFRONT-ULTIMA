import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddicionalsComponent } from './addicionals.component';

describe('AddicionalsComponent', () => {
  let component: AddicionalsComponent;
  let fixture: ComponentFixture<AddicionalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddicionalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddicionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
