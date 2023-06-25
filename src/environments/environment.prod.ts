export const environment = {
    production: true,
    api: {
        baseUrl: "https://simvet.pladema.net:3000/api",
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
        roles: "/auth/roles",
        userManual: '/files/user-manual.pdf'
    },
    simulation: "https://simvet.pladema.net/monitor",
    userManual: '/files/user-manual.pdf'


};
