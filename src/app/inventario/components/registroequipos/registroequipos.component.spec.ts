import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroequiposComponent } from './registroequipos.component';

describe('RegistroequiposComponent', () => {
  let component: RegistroequiposComponent;
  let fixture: ComponentFixture<RegistroequiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroequiposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroequiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
