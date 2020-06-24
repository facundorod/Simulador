import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCardiacComponent } from './cycle-cardiac.component';

describe('CycleCardiacComponent', () => {
  let component: CycleCardiacComponent;
  let fixture: ComponentFixture<CycleCardiacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycleCardiacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleCardiacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
