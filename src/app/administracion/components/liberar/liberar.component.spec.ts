import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarComponent } from './liberar.component';

describe('LiberarComponent', () => {
  let component: LiberarComponent;
  let fixture: ComponentFixture<LiberarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiberarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
