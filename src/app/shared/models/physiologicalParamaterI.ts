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
    source?: PhysiologicalParamaterI;
}
