// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    api: {
        baseUrl: "http://localhost:8001/api",
        animalSpecies: "/animalSpecies/",
        arrhythmias: "/arrhythmia/",
        medications: "/medication/",
        pathologies: "/pathology/",
        scenarios: "/scenario/",
        login: "/auth/login",
        register: "/auth/register",
        simulations: "/simulation/",
        curves: "/curves/",
    },
    apiUsers: "http://localhost:8001/api/auth",
    simulation: "http://localhost:4200/simulation",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.