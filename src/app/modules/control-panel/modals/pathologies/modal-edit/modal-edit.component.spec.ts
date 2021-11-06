import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditComponentPath } from './modal-edit.component';

describe('ModalEditComponent', () => {
    let component: ModalEditComponentPath;
    let fixture: ComponentFixture<ModalEditComponentPath>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalEditComponentPath]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalEditComponentPath);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
