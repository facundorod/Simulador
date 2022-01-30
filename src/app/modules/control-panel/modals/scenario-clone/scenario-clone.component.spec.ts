import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioCloneComponent } from './scenario-clone.component';

describe('ScenarioCloneComponent', () => {
  let component: ScenarioCloneComponent;
  let fixture: ComponentFixture<ScenarioCloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioCloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
