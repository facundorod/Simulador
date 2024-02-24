export const curvesConfiguration = {
    MAX_MONITOR: 12,
    SAMPLING_RATE: 10,
    STEPS: 0.024,
    STEPS_BREATH: 0.024,
    STEPS_HEART: 0.024,
    TOTAL_POINTS: 20,
    CURVE_POINTS: 12,
    DELAY_TIME: 20,
    CURVE_CONSTANT: () => {
        const curve: [number, number][] = [];
        for (let i = 0; i < curvesConfiguration.TOTAL_POINTS * curvesConfiguration.MAX_MONITOR; i++) {
            curve.push([0, 0])
        }
        return curve;
    }
}
