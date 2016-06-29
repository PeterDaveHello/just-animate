export const easings: ja.IMap<string> = {
    easeInBack: cubicBezier(0.600, -0.280, 0.735, 0.045),
    easeInCirc: cubicBezier(0.600, 0.040, 0.980, 0.335),
    easeInCubic: cubicBezier(0.550, 0.055, 0.675, 0.190),
    easeInExpo: cubicBezier(0.950, 0.050, 0.795, 0.035),
    easeInOutBack: cubicBezier(0.680, -0.550, 0.265, 1.550),
    easeInOutCirc: cubicBezier(0.785, 0.135, 0.150, 0.860),
    easeInOutCubic: cubicBezier(0.645, 0.045, 0.355, 1.000),
    easeInOutExpo: cubicBezier(1.000, 0.000, 0.000, 1.000),
    easeInOutQuad: cubicBezier(0.455, 0.030, 0.515, 0.955),
    easeInOutQuart: cubicBezier(0.770, 0.000, 0.175, 1.000),
    easeInOutQuint: cubicBezier(0.860, 0.000, 0.070, 1.000),
    easeInOutSine: cubicBezier(0.445, 0.050, 0.550, 0.950),
    easeInQuad: cubicBezier(0.550, 0.085, 0.680, 0.530),
    easeInQuart: cubicBezier(0.895, 0.030, 0.685, 0.220),
    easeInQuint: cubicBezier(0.755, 0.050, 0.855, 0.060),
    easeInSine: cubicBezier(0.470, 0.000, 0.745, 0.715),
    easeOutBack: cubicBezier(0.175,  0.885, 0.320, 1.275),
    easeOutCirc: cubicBezier(0.075, 0.820, 0.165, 1.000),
    easeOutCubic: cubicBezier(0.215, 0.610, 0.355, 1.000),
    easeOutExpo: cubicBezier(0.190, 1.000, 0.220, 1.000),
    easeOutQuad: cubicBezier(0.250, 0.460, 0.450, 0.940),
    easeOutQuart: cubicBezier(0.165, 0.840, 0.440, 1.000),
    easeOutQuint: cubicBezier(0.230, 1.000, 0.320, 1.000),
    easeOutSine: cubicBezier(0.390, 0.575, 0.565, 1.000),
    elegantSlowStartEnd: cubicBezier(0.175, 0.885, 0.320, 1.275)
};

function cubicBezier(p1: number, p2: number, p3: number, p4: number): string {
    return 'cubic-bezier(' + [p1, p2, p3, p4].join(' ') + ')';
}