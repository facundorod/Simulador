import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersLoadComponent } from './parameters-load.component';

describe('ParametersLoadComponent', () => {
  let component: ParametersLoadComponent;
  let fixture: ComponentFixture<ParametersLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametersLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
