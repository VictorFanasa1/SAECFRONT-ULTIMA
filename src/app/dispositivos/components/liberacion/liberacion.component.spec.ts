import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberacionComponent } from './liberacion.component';

describe('LiberacionComponent', () => {
  let component: LiberacionComponent;
  let fixture: ComponentFixture<LiberacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiberacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
