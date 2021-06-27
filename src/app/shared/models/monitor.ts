import { MonitorI } from "./monitorI";

export class Monitor {
    private monitorConfiguration: MonitorI = {
        clockTimer: 50,
        freqSample: 50,
        maxSamples: 4
    };

    public constructor() { }

    public setMonitorConfiguration(monitor: MonitorI): void {
        this.monitorConfiguration = monitor;
    }

    public getMonitorConfiguration(): MonitorI {
        return this.monitorConfiguration;
    }
}
