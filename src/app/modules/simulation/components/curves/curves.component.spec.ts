import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurvesComponent } from './curves.component';

describe('CurvesComponent', () => {
  let component: CurvesComponent;
  let fixture: ComponentFixture<CurvesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurvesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurvesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
