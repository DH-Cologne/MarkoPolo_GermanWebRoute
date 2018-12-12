import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlviewComponent } from './xmlview.component';

describe('XmlviewComponent', () => {
  let component: XmlviewComponent;
  let fixture: ComponentFixture<XmlviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmlviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
