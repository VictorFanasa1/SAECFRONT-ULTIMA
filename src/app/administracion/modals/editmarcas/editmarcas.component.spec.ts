import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmarcasComponent } from './editmarcas.component';

describe('EditmarcasComponent', () => {
  let component: EditmarcasComponent;
  let fixture: ComponentFixture<EditmarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmarcasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditmarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
