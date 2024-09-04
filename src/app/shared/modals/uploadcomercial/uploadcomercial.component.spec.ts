import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadcomercialComponent } from './uploadcomercial.component';

describe('UploadcomercialComponent', () => {
  let component: UploadcomercialComponent;
  let fixture: ComponentFixture<UploadcomercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadcomercialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadcomercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
