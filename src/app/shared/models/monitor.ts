import { MonitorI } from './monitorI';

export class Monitor {
    private monitorConfiguration: MonitorI = {
        clockTimer: 25,
        freqHeart: 20,
        freqHeart2: 20,
        freqBreath: 15,
        maxSamples: 6.5,
    };

    public constructor() {
        const monitorConfiguration: MonitorI = JSON.parse(
            localStorage.getItem('monitor')
        );
        if (monitorConfiguration) {
            this.monitorConfiguration = monitorConfiguration;
        }
    }

    public setMonitorConfiguration(monitor: MonitorI): void {
        this.monitorConfiguration = monitor;
    }

    public getMonitorConfiguration(): MonitorI {
        return this.monitorConfiguration;
    }
}
