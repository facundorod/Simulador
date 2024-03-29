export const curvesConfiguration = {
    MAX_MONITOR: 12,
    SAMPLING_RATE: 10,
    STEPS: 0.024,
    STEPS_BREATH: 0.024,
    STEPS_HEART: 0.024,
    // Tiempo que tarda la curva principal en dibujarse (Tiempo del latido del corazon)
    CURVE_TIME: 0.3,
    TOTAL_POINTS: 25,
    CURVE_POINTS: 0.4 * 25,
    CURVE_CONSTANT: () => {
        const curve: [number, number][] = [];
        for (let i = 0; i < curvesConfiguration.TOTAL_POINTS * curvesConfiguration.MAX_MONITOR; i++) {
            curve.push([0, 0])
        }
        return curve;
    }
}
