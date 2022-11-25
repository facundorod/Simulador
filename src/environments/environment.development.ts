export const environment = {
    production: false,
    api: {
        baseUrl: "http://54.208.101.214:3000/api",
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
        refCurves: '/refCurves',
        curves: "/curves/",
        parameters: "/parameters/",
        user: "/auth/user",
        users: "/auth/users",
        roles: "/auth/roles",
        userManual: '/files/user-manual.pdf'
    },
    simulation: "https://simvet-web.herokuapp.com/monitor",
    userManual: 'http://54.208.101.214:3000/files/user-manual.pdf'
};
