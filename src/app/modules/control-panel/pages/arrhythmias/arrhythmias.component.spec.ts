import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrhythmiasComponent } from './arrhythmias.component';

describe('ArrhythmiasComponent', () => {
  let component: ArrhythmiasComponent;
  let fixture: ComponentFixture<ArrhythmiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrhythmiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrhythmiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
