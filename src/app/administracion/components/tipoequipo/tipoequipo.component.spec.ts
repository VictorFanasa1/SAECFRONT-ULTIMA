import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoequipoComponent } from './tipoequipo.component';

describe('TipoequipoComponent', () => {
  let component: TipoequipoComponent;
  let fixture: ComponentFixture<TipoequipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoequipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoequipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
