import { CurvesInformationI } from "./CurvesInformationI";
import { ParameterInfoI } from "./parameterInfoI";

export interface MonitorStateI {
    curvesInformation: CurvesInformationI[],
    scenario: {
        name: string,
        description: string,
        animalName: string
    },
    id: number;
    simulationStatus: 'RUNNING' | 'STOP' | 'PAUSED' | 'OFF',
    heartSamplingRate: number,
    batteryStatus: 'LOW' | 'NORMAL',
    breathSamplingRate: number,
    soundStatus: {
        alarms: boolean,
        heartFreqSound: boolean,
        batterySound: boolean
    },
    totalPoints: number;
    totalPointsPerCycle: number;
    currentIndexHeart?: number,
    currentIndexBreath?: number,
    parameterInformation: ParameterInfoI
}
