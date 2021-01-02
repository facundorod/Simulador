import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalSpeciesListComponent } from './animal-species.list.component';

describe('AnimalSpeciesListComponent', () => {
  let component: AnimalSpeciesListComponent;
  let fixture: ComponentFixture<AnimalSpeciesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalSpeciesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalSpeciesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
