import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliberadosComponent } from './preliberados.component';

describe('PreliberadosComponent', () => {
  let component: PreliberadosComponent;
  let fixture: ComponentFixture<PreliberadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreliberadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliberadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
