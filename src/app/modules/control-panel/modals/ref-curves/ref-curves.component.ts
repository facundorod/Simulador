import { Component, OnInit } from '@angular/core';
import { CurveValues } from '@app/shared/models/curveValues';
import { RefCurvesI } from '@app/shared/models/refCurvesI';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ref-curves',
    templateUrl: './ref-curves.component.html',
    styleUrls: ['./ref-curves.component.css']
})
export class RefCurvesComponent implements OnInit {

    private refCurves: RefCurvesI[];
    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }


    public setRefCurves(refCurves: RefCurvesI[]): void {
        if (refCurves) this.refCurves = refCurves;
    }


    public onFileChange(event: any): void {
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                const csvData = reader.result;
                const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
                const records: CurveValues[] = this.getCurvesFromCSV(csvRecordsArray);
                const formattedCurves: [number, number][] = records.map((value: CurveValues) => {
                    return [value.t, value.value];
                });
                this.activeModal.close({ curves: formattedCurves, name: "Custom curve", description: "Custom curve" });
            };
            reader.onerror = function () {
                console.log('error is occured while reading file!');
            };
        }
    }

    public getCurvesFromCSV(csvRecordsArray: any) {
        const csvArr = [];
        try {
            for (let i = 1; i < csvRecordsArray.length; i++) {
                const currentRecord = (csvRecordsArray[i] as string).split(';');
                if (currentRecord[0] && currentRecord[1]) {
                    currentRecord[0] = currentRecord[0].replace(',', '.');
                    currentRecord[1] = currentRecord[1].replace(',', '.');
                    const csvRecord: CurveValues = new CurveValues();
                    csvRecord.t = Number(currentRecord[0]);
                    csvRecord.value = Number(currentRecord[1]);
                    if (
                        !csvArr.some((value: CurveValues) => {
                            return value.t === csvRecord.t;
                        }) &&
                        (csvRecord.t != null || csvRecord.value != null)
                    ) {
                        csvArr.push(csvRecord);
                    }
                }
            }

            return csvArr;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public getRefCurves(): RefCurvesI[] {
        return this.refCurves;
    }

    public onSelectCurve(refCurve: RefCurvesI): void {
        this.activeModal.close(refCurve);
    }

    public onCancelModal(): void {
        this.activeModal.close();
    }

}
