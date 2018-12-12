import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphviewComponent } from './graphview.component';

describe('GraphviewComponent', () => {
  let component: GraphviewComponent;
  let fixture: ComponentFixture<GraphviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
