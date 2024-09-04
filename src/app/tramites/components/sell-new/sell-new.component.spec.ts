import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellNewComponent } from './sell-new.component';

describe('SellNewComponent', () => {
  let component: SellNewComponent;
  let fixture: ComponentFixture<SellNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
