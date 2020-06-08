import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalSpeciesComponent } from './animal-species.component';

describe('AnimalSpeciesComponent', () => {
  let component: AnimalSpeciesComponent;
  let fixture: ComponentFixture<AnimalSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalSpeciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
