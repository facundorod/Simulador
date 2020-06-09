import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrhythmiaComponent } from './arrhythmia.component';

describe('ArrhythmiaComponent', () => {
  let component: ArrhythmiaComponent;
  let fixture: ComponentFixture<ArrhythmiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrhythmiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrhythmiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
