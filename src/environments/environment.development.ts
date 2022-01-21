export const environment = {
    production: false,
    api: {
        baseUrl: "https://simvet-api.herokuapp.com/api",
        animalSpecies: "/animalSpecies/",
        arrhythmias: "/arrhythmia/",
        medications: "/medication/",
        pathologies: "/pathology/",
        scenarios: "/scenario/",
        scenariosParams: "/scenario/parameters",
        login: "/auth/login",
        register: "/auth/register",
        simulations: "/simulation/",
        curves: "/curves/",
        parameters: "/parameters/",
        user: "/auth/user",
    },
    simulation: "https://simvet-web.herokuapp.com/monitor",
};
