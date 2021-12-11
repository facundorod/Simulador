import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioParamsCreateComponent } from './scenario-params-create.component';

describe('ScenarioParamsCreateComponent', () => {
  let component: ScenarioParamsCreateComponent;
  let fixture: ComponentFixture<ScenarioParamsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioParamsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioParamsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
