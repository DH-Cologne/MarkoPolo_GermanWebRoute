import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextviewComponent } from './textview.component';

describe('TextviewComponent', () => {
  let component: TextviewComponent;
  let fixture: ComponentFixture<TextviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
