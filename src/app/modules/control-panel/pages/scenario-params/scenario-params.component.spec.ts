import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioParamsComponent } from './scenario-params.component';

describe('ScenarioParamsComponent', () => {
  let component: ScenarioParamsComponent;
  let fixture: ComponentFixture<ScenarioParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
