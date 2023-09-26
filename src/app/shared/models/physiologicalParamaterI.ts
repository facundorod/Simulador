export interface PhysiologicalParamaterI {
    id_pp: number;
    name: string;
    description: string;
    label: string;
    unit: string;
    colorLine?: string;
    specialConfiguration?: JSON;
    updated_at?: Date;
    created_at?: Date;
    source?: string;
    alert_high?: number;
    alert_high_2?: number;
    order?: number;
    alert_low?: number;
    showInMonitor?: boolean;
    alert_low_2?: number;
    maxY?: number;
    value?: number;
    curves?: {
        original: [number, number][],
        dataset: [number, number][]
    }
}
