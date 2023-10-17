import { BatteryStatusEnum } from "../enum/batteryStatusEnum";
import { SimulationStatusEnum } from "../enum/simulationStatusEnum";
import { InputParameterI } from "./inputParameters";
import { PhysiologicalParamaterI } from "./physiologicalParamaterI";

export interface MonitorSound {
    alarms: boolean;
    heartFreqSound: boolean;
    batterySound: boolean;
}

export interface MonitorStateI {
    id: string;
    parametersWithCurves: PhysiologicalParamaterI[],
    scenario: {
        name: string,
        description: string,
        animalName: string
    },
    nibpMeasurement: {
        time: number,
        startInmediatly: boolean
    }
    simulationStatus: SimulationStatusEnum,
    batteryStatus: BatteryStatusEnum,
    soundStatus: MonitorSound,
    parameterInformation: InputParameterI
}
