import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditordenComponent } from './editorden.component';

describe('EditordenComponent', () => {
  let component: EditordenComponent;
  let fixture: ComponentFixture<EditordenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditordenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditordenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
