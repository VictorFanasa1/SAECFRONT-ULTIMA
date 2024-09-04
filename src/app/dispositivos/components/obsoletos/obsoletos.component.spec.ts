import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsoletosComponent } from './obsoletos.component';

describe('ObsoletosComponent', () => {
  let component: ObsoletosComponent;
  let fixture: ComponentFixture<ObsoletosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObsoletosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsoletosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
