-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2020-05-18 13:54:42.471

-- tables
-- Table: AnimalSpecies
CREATE TABLE AnimalSpecies (
    id_as serial  NOT NULL,
    name varchar  NOT NULL,
    CONSTRAINT pk_AnimalSpecies PRIMARY KEY (id_as)
);

-- Table: Arrhytmia
CREATE TABLE Arrhytmia (
    id_arr serial  NOT NULL,
    name varchar  NOT NULL,
    description varchar  NOT NULL,
    CONSTRAINT pk_Arrythmia PRIMARY KEY (id_arr)
);

-- Table: ArrhytmiaPerScenario
CREATE TABLE ArrhytmiaPerScenario (
    id_scenario int  NOT NULL,
    id_arr int  NOT NULL,
    CONSTRAINT ArrhytmiaPerScenario_pk PRIMARY KEY (id_scenario,id_arr)
);

-- Table: MPerScenario
CREATE TABLE MPerScenario (
    id_scenario serial  NOT NULL,
    id_medication serial  NOT NULL,
    dose int  NOT NULL,
    unit varchar  NOT NULL,
    CONSTRAINT MPerScenario_pk PRIMARY KEY (id_scenario,id_medication)
);

-- Table: Medication
CREATE TABLE Medication (
    id_medication serial  NOT NULL,
    name varchar  NOT NULL,
    description varchar  NOT NULL,
    CONSTRAINT pk_Medication PRIMARY KEY (id_medication)
);

-- Table: PCurve
CREATE TABLE PCurve (
    id_as serial  NOT NULL,
    id_pp serial  NOT NULL,
    id_scenario serial  NOT NULL,
    t int  NOT NULL,
    value int  NOT NULL,
    CONSTRAINT pk_Pcurve PRIMARY KEY (id_as,id_pp,id_scenario,t)
);

-- Table: PPperAS
CREATE TABLE PPperAS (
    id_as serial  NOT NULL,
    id_pp serial  NOT NULL,
    alarm_low int  NOT NULL,
    alarm_high int  NOT NULL,
    CONSTRAINT pk_PPperAs PRIMARY KEY (id_as,id_pp)
);

-- Table: Patology
CREATE TABLE Patology (
    id_pat serial  NOT NULL,
    name varchar  NOT NULL,
    description varchar  NOT NULL,
    CONSTRAINT pk_Patology PRIMARY KEY (id_pat)
);

-- Table: PatologyPerScenario
CREATE TABLE PatologyPerScenario (
    id_scenario serial  NOT NULL,
    id_pat serial  NOT NULL,
    CONSTRAINT PatologyPerScenario_pk PRIMARY KEY (id_scenario,id_pat)
);

-- Table: PhysiologicalParameter
CREATE TABLE PhysiologicalParameter (
    id_pp serial  NOT NULL,
    name varchar  NOT NULL,
    description varchar  NOT NULL,
    label varchar  NOT NULL,
    unit varchar  NOT NULL,
    CONSTRAINT pk_PhysiologicalParameter PRIMARY KEY (id_pp)
);

-- Table: Role
CREATE TABLE Role (
    id_role serial  NOT NULL,
    name varchar  NOT NULL,
    CONSTRAINT pk_Role PRIMARY KEY (id_role)
);

-- Table: SPP
CREATE TABLE SPP (
    id_as serial  NOT NULL,
    id_pp serial  NOT NULL,
    id_scenario serial  NOT NULL,
    CONSTRAINT pk_spp PRIMARY KEY (id_as,id_pp,id_scenario)
);

-- Table: Scenario
CREATE TABLE Scenario (
    id_scenario serial  NOT NULL,
    name varchar  NOT NULL,
    description varchar  NOT NULL,
    CONSTRAINT Scenario_pk PRIMARY KEY (id_scenario)
);

-- Table: ScenarioperSimulation
CREATE TABLE ScenarioperSimulation (
    id_scenario int  NOT NULL,
    id_simulation int  NOT NULL,
    CONSTRAINT ScenarioperSimulation_pk PRIMARY KEY (id_scenario,id_simulation)
);

-- Table: Sesion
CREATE TABLE Sesion (
    id_user serial  NOT NULL,
    id_role serial  NOT NULL,
    CONSTRAINT pk_Sesion PRIMARY KEY (id_user,id_role)
);

-- Table: Simulation
CREATE TABLE Simulation (
    id_simulation serial  NOT NULL,
    name varchar  NOT NULL,
    description varchar  NOT NULL,
    id_as int  NOT NULL,
    CONSTRAINT Simulation_pk PRIMARY KEY (id_simulation)
);

-- Table: User
CREATE TABLE "User" (
    id_user Serial  NOT NULL,
    e_mail varchar  NOT NULL,
    name varchar  NOT NULL,
    surname varchar  NOT NULL,
    password varchar  NOT NULL,
    institution varchar  NULL,
    CONSTRAINT uq_user UNIQUE (e_mail) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT pk_user PRIMARY KEY (id_user)
);

-- foreign keys
-- Reference: ArrhytmiaPerScenario_Arrhytmia (table: ArrhytmiaPerScenario)
ALTER TABLE ArrhytmiaPerScenario ADD CONSTRAINT ArrhytmiaPerScenario_Arrhytmia
    FOREIGN KEY (id_arr)
    REFERENCES Arrhytmia (id_arr)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: ArrhytmiaPerScenario_Scenario (table: ArrhytmiaPerScenario)
ALTER TABLE ArrhytmiaPerScenario ADD CONSTRAINT ArrhytmiaPerScenario_Scenario
    FOREIGN KEY (id_scenario)
    REFERENCES Scenario (id_scenario)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: MPerScenario_Medication (table: MPerScenario)
ALTER TABLE MPerScenario ADD CONSTRAINT MPerScenario_Medication
    FOREIGN KEY (id_medication)
    REFERENCES Medication (id_medication)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: MPerScenario_Scenario (table: MPerScenario)
ALTER TABLE MPerScenario ADD CONSTRAINT MPerScenario_Scenario
    FOREIGN KEY (id_scenario)
    REFERENCES Scenario (id_scenario)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PCurve_SPP (table: PCurve)
ALTER TABLE PCurve ADD CONSTRAINT PCurve_SPP
    FOREIGN KEY (id_as, id_pp, id_scenario)
    REFERENCES SPP (id_as, id_pp, id_scenario)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PPperAS_AnimalSpecies (table: PPperAS)
ALTER TABLE PPperAS ADD CONSTRAINT PPperAS_AnimalSpecies
    FOREIGN KEY (id_as)
    REFERENCES AnimalSpecies (id_as)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PPperAS_PhysiologicalParameter (table: PPperAS)
ALTER TABLE PPperAS ADD CONSTRAINT PPperAS_PhysiologicalParameter
    FOREIGN KEY (id_pp)
    REFERENCES PhysiologicalParameter (id_pp)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PatologyPerScenario_Patology (table: PatologyPerScenario)
ALTER TABLE PatologyPerScenario ADD CONSTRAINT PatologyPerScenario_Patology
    FOREIGN KEY (id_pat)
    REFERENCES Patology (id_pat)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PatologyPerScenario_Scenario (table: PatologyPerScenario)
ALTER TABLE PatologyPerScenario ADD CONSTRAINT PatologyPerScenario_Scenario
    FOREIGN KEY (id_scenario)
    REFERENCES Scenario (id_scenario)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: SPP_PPperAS (table: SPP)
ALTER TABLE SPP ADD CONSTRAINT SPP_PPperAS
    FOREIGN KEY (id_as, id_pp)
    REFERENCES PPperAS (id_as, id_pp)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: SPP_Scenario (table: SPP)
ALTER TABLE SPP ADD CONSTRAINT SPP_Scenario
    FOREIGN KEY (id_scenario)
    REFERENCES Scenario (id_scenario)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: ScenarioperSimulation_Scenario (table: ScenarioperSimulation)
ALTER TABLE ScenarioperSimulation ADD CONSTRAINT ScenarioperSimulation_Scenario
    FOREIGN KEY (id_scenario)
    REFERENCES Scenario (id_scenario)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: ScenarioperSimulation_Simulation (table: ScenarioperSimulation)
ALTER TABLE ScenarioperSimulation ADD CONSTRAINT ScenarioperSimulation_Simulation
    FOREIGN KEY (id_simulation)
    REFERENCES Simulation (id_simulation)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Sesion_Role (table: Sesion)
ALTER TABLE Sesion ADD CONSTRAINT Sesion_Role
    FOREIGN KEY (id_role)
    REFERENCES Role (id_role)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Sesion_User (table: Sesion)
ALTER TABLE Sesion ADD CONSTRAINT Sesion_User
    FOREIGN KEY (id_user)
    REFERENCES "User" (id_user)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Simulation_AnimalSpecies (table: Simulation)
ALTER TABLE Simulation ADD CONSTRAINT Simulation_AnimalSpecies
    FOREIGN KEY (id_as)
    REFERENCES AnimalSpecies (id_as)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

