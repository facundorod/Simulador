import { MonitorI } from "./monitorI";

export class Monitor {
    private monitorConfiguration: MonitorI = {
        clockTimer: 50,
        freqSampleHeart: 50,
        freqSampleBreath: 20,
        maxSamples: 6
    };

    public constructor() { }

    public setMonitorConfiguration(monitor: MonitorI): void {
        this.monitorConfiguration = monitor;
    }

    public getMonitorConfiguration(): MonitorI {
        return this.monitorConfiguration;
    }
}
