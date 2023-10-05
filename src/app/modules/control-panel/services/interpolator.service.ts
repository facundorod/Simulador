import { Injectable } from '@angular/core';
import LinearInterpolation from 'linear-interpolator'

@Injectable({
    providedIn: 'root'
})
export class InterpolatorService {
    private interpolator;

    constructor() { }

    public setDataset(dataset: number[][]): void {
        this.interpolator = new LinearInterpolation(dataset)
    }

    public interpolateXValue(xValue: number): number {
        return this.interpolator(xValue)
    }
}
