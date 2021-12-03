import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewParameterComponent } from './new-parameter.component';

describe('NewParameterComponent', () => {
  let component: NewParameterComponent;
  let fixture: ComponentFixture<NewParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
