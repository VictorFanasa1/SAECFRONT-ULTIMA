import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditequipoComponent } from './editequipo.component';

describe('EditequipoComponent', () => {
  let component: EditequipoComponent;
  let fixture: ComponentFixture<EditequipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditequipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditequipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
