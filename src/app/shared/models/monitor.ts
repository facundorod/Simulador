import { MonitorI } from "./monitorI";

export class Monitor {
    private monitorConfiguration: MonitorI = {
        clockTimer: 60,
        freqHeart: 45,
        freqBreath: 30,
        maxSamples: 6,
    };

    public constructor() {
        const monitorConfiguration: MonitorI = JSON.parse(
            localStorage.getItem("monitor")
        );
        if (monitorConfiguration)
            this.monitorConfiguration = monitorConfiguration;
    }

    public setMonitorConfiguration(monitor: MonitorI): void {
        this.monitorConfiguration = monitor;
    }

    public getMonitorConfiguration(): MonitorI {
        return this.monitorConfiguration;
    }
}
