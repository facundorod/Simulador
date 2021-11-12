import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditComponentArr } from './modal-edit.component';

describe('ModalEditComponent', () => {
    let component: ModalEditComponentArr;
    let fixture: ComponentFixture<ModalEditComponentArr>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalEditComponentArr]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalEditComponentArr);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
