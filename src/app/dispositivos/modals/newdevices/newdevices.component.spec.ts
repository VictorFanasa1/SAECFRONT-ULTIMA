import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdevicesComponent } from './newdevices.component';

describe('NewdevicesComponent', () => {
  let component: NewdevicesComponent;
  let fixture: ComponentFixture<NewdevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewdevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewdevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
