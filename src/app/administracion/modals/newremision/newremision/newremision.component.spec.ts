import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewremisionComponent } from './newremision.component';

describe('NewremisionComponent', () => {
  let component: NewremisionComponent;
  let fixture: ComponentFixture<NewremisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewremisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewremisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
