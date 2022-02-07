import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NibpComponent } from './nibp.component';

describe('NibpComponent', () => {
  let component: NibpComponent;
  let fixture: ComponentFixture<NibpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NibpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NibpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
