import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorSoundsComponent } from './monitor-sounds.component';

describe('MonitorSoundsComponent', () => {
  let component: MonitorSoundsComponent;
  let fixture: ComponentFixture<MonitorSoundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorSoundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorSoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
