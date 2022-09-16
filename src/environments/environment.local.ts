export const environment = {
    production: false,
    api: {
        baseUrl: "http://localhost:3000/api",
        animalSpecies: "/animalSpecies/",
        arrhythmias: "/arrhythmia/",
        medications: "/medication/",
        pathologies: "/pathology/",
        scenarios: "/scenario/",
        scenariosParams: "/scenario/parameters",
        login: "/auth/login",
        register: "/auth/register",
        verifyToken: "/auth/verify",
        simulations: "/simulation/",
        curves: "/curves/",
        refCurves: '/refCurves',
        parameters: "/parameters/",
        user: "/auth/user",
        users: "/auth/users",
        roles: "/auth/roles"
    },
    simulation: "http://localhost:4200/monitor",
    userManual: 'http://localhost:3000/files/user-manual.pdf'
};
