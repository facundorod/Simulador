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
    simulationStatus: SimulationStatusEnum,
    batteryStatus: BatteryStatusEnum,
    // breathSamplingRate: number,
    soundStatus: MonitorSound,
    parameterInformation: InputParameterI
}
