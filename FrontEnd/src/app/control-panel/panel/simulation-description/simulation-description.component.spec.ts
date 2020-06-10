import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationDescriptionComponent } from './simulation-description.component';

describe('SimulationDescriptionComponent', () => {
  let component: SimulationDescriptionComponent;
  let fixture: ComponentFixture<SimulationDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
