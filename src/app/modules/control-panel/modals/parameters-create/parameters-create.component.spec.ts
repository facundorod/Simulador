import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersCreateComponent } from './parameters-create.component';

describe('ParametersCreateComponent', () => {
  let component: ParametersCreateComponent;
  let fixture: ComponentFixture<ParametersCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametersCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
