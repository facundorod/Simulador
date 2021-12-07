import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorConfigsComponent } from './monitor-configs.component';

describe('MonitorConfigsComponent', () => {
  let component: MonitorConfigsComponent;
  let fixture: ComponentFixture<MonitorConfigsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorConfigsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
