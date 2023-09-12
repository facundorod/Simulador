import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Monitor2Component } from './monitor2.component';

describe('Monitor2Component', () => {
  let component: Monitor2Component;
  let fixture: ComponentFixture<Monitor2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Monitor2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Monitor2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
