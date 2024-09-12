import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaccesoriosComponent } from './editaccesorios.component';

describe('EditaccesoriosComponent', () => {
  let component: EditaccesoriosComponent;
  let fixture: ComponentFixture<EditaccesoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditaccesoriosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditaccesoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
