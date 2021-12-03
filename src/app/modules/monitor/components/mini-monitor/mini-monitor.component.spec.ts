import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniMonitorComponent } from './mini-monitor.component';

describe('MiniMonitorComponent', () => {
  let component: MiniMonitorComponent;
  let fixture: ComponentFixture<MiniMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
