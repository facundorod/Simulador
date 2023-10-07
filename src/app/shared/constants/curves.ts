export const curvesConfiguration = {
    MAX_MONITOR: 8,
    STEPS: 0.024,
    STEPS_BREATH: 0.024,
    STEPS_HEART: 0.025,
    // Tiempo que tarda la curva principal en dibujarse (Tiempo del latido del corazon)
    CURVE_TIME: 0.4,
    TOTAL_POINTS: 40,
    CURVE_POINTS: 0.4 * 40,
    CURVE_CONSTANT: () => {
        const curves: [number, number][] = [];
        for (let i = 0; i < curvesConfiguration.TOTAL_POINTS * curvesConfiguration.MAX_MONITOR; i++) {
            curves.push([0, 0])
        }
        return curves;
    }
}
