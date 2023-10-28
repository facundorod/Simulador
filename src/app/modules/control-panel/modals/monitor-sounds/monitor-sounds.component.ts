import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MonitorSound } from '@app/shared/models/MonitorStateI';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-monitor-sounds',
  templateUrl: './monitor-sounds.component.html',
  styleUrls: ['./monitor-sounds.component.css']
})
export class MonitorSoundsComponent implements OnInit {
    isLoading: boolean = true;
    private monitorSound: MonitorSound;
    soundForm: FormGroup;


    constructor(private formGroup: FormBuilder,  private activeModal: NgbActiveModal) {
    }

    public setMonitorSound(sound: MonitorSound): void {
        this.monitorSound = sound;
        this.initFormGroup();
        this.isLoading = false;
    }

    ngOnInit(): void {
    }

    private initFormGroup(): void {
        this.soundForm = this.formGroup.group({
            heartFreqSound: this.monitorSound && this.monitorSound.heartFreqSound !== undefined ?
                this.monitorSound.heartFreqSound : true,
            alarms: this.monitorSound && this.monitorSound.alarms !== undefined ?
                this.monitorSound.alarms : true,
            batterySound: this.monitorSound && this.monitorSound.batterySound !== undefined ?
                this.monitorSound.batterySound : true
        })
    }

    public onCancel(): void {
        this.activeModal.close();
    }

    public onSubmit(): void {
        if (this.soundForm.valid) {
            this.activeModal.close(this.soundForm.value);
        }
    }
}
