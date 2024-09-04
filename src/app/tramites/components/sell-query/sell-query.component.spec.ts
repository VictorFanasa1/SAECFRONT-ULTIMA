import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellQueryComponent } from './sell-query.component';

describe('SellQueryComponent', () => {
  let component: SellQueryComponent;
  let fixture: ComponentFixture<SellQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
