declare var window: Window & { Just: ja.JustAnimate & ja.IAnimationInjectable };
declare var angular: any;

import {JustAnimate} from './JustAnimate';
import {isDefined} from './core/utils';

// register with angular if it is present
if (typeof angular !== 'undefined') {
    angular.module('just.animate', []).service('just', JustAnimate);
}

// create manager if it doesn't yet exist
let animationManager: ja.IAnimationManager = undefined;
function getManager(): ja.IAnimationManager {
    if (!isDefined(animationManager)) {
        animationManager = new JustAnimate();
    }
    return animationManager;
}

// add animation properties to global Just
const just: ja.IAnimationManager & ja.IAnimationInjectable = {
    animate(keyframesOrName: string | ja.IIndexed<ja.IKeyframe>, el: ja.ElementSource, timings?: ja.IAnimationEffectTiming): ja.IAnimator {
        return getManager().animate(keyframesOrName, el, timings);
    },
    animateSequence(options: ja.ISequenceOptions): ja.IAnimator {
        return getManager().animateSequence(options);
    },
    animateTimeline(options: ja.ITimelineOptions): ja.IAnimator {
        return getManager().animateTimeline(options);
    },
    findAnimation(name: string): ja.IKeyframeOptions {
        return getManager().findAnimation(name);
    },
    inject(animations: ja.IAnimationOptions[]): void {
        JustAnimate.inject(animations);
    },
    register(animationOptions: ja.IAnimationOptions): ja.IAnimationManager {
        return getManager().register(animationOptions);
    }
};


window.Just = just;
