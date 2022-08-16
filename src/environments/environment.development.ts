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
        verifyToken: "/auth/verify",
        login: "/auth/login",
        register: "/auth/register",
        simulations: "/simulation/",
        curves: "/curves/",
        parameters: "/parameters/",
        user: "/auth/user",
        users: "/auth/users",
        roles: "/auth/roles",
        userManual: '/files/user-manual.pdf'
    },
    simulation: "https://simvet-web.herokuapp.com/monitor",
    userManual: 'https://simvet-api.herokuapp.com/files/user-manual.pdf'
};
