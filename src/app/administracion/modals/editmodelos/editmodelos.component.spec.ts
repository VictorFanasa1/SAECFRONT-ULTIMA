import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmodelosComponent } from './editmodelos.component';

describe('EditmodelosComponent', () => {
  let component: EditmodelosComponent;
  let fixture: ComponentFixture<EditmodelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmodelosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditmodelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
