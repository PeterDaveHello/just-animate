"use strict";
var easings_1 = require('../easings');
var literals_1 = require('./literals');
var utils_1 = require('./utils');
var Transformers_1 = require('./Transformers');
var ElementResolver_1 = require('./ElementResolver');
/**
 * Animates one or more elements
 *
 * @export
 * @class ElementAnimator
 * @implements {ja.IAnimator}
 */
var ElementAnimator = (function () {
    /**
     * Creates an instance of ElementAnimator.
     *
     * @param {ja.IAnimationManager} manager JustAnimate instance
     * @param {(string | ja.IIndexed<ja.IKeyframe>)} keyframesOrName keyframe definition or name of registered animation
     * @param {ja.ElementSource} el element or element source to animate
     * @param {ja.IAnimationEffectTiming} [timings] optional timing overrides.  required when passing in keyframes
     */
    function ElementAnimator(manager, keyframesOrName, el, timings) {
        var _this = this;
        if (!keyframesOrName) {
            return;
        }
        var keyframes;
        if (utils_1.isString(keyframesOrName)) {
            // if keyframes is a string, lookup keyframes from registry
            var definition = manager.findAnimation(keyframesOrName);
            keyframes = definition.keyframes;
            // use registered timings as default, then load timings from params           
            timings = utils_1.extend({}, definition.timings, timings);
        }
        else {
            // otherwise, translate keyframe properties
            keyframes = Transformers_1.normalizeKeyframes(utils_1.map(keyframesOrName, Transformers_1.keyframeTransformer));
        }
        if (timings && timings.easing) {
            // if timings contains an easing property, 
            var cubicEasing = easings_1.cubicEasings[timings.easing];
            if (cubicEasing) {
                timings.easing = utils_1.transformFunction(literals_1.cubicBezier, cubicEasing);
            }
        }
        // add duration to object    
        this.duration = timings.duration;
        // get list of elements to animate
        var elements = ElementResolver_1.resolveElements(el);
        // call .animate on all elements and get a list of their players        
        this._animators = utils_1.multiapply(elements, 'animate', [keyframes, timings]);
        // hookup finish event for when it happens naturally    
        if (this._animators.length > 0) {
            // todo: try to find a better way than just listening to one of them
            /**
             * (description)
             */
            this._animators[0].onfinish = function () {
                _this.finish();
            };
        }
    }
    Object.defineProperty(ElementAnimator.prototype, "playbackRate", {
        /**
         * Returns 0 when not playing, 1 when playing forward, and -1 when playing backward
         *
         * @type {number}
         */
        get: function () {
            var first = utils_1.head(this._animators);
            return first ? first.playbackRate : 0;
        },
        /**
         * Sets the playbackRate to the specified value
         */
        set: function (val) {
            utils_1.each(this._animators, function (a) { return a.playbackRate = val; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementAnimator.prototype, "currentTime", {
        /**
         * Returns current time of the animation
         *
         * @type {number}
         */
        get: function () {
            return utils_1.max(this._animators, 'currentTime') || 0;
        },
        /**
         * Sets the animation current time
         */
        set: function (elapsed) {
            utils_1.each(this._animators, function (a) { return a.currentTime = elapsed; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Finishes the current animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of the Element Animator
     */
    ElementAnimator.prototype.finish = function (fn) {
        var _this = this;
        utils_1.multiapply(this._animators, 'finish', [], fn);
        if (this.playbackRate < 0) {
            utils_1.each(this._animators, function (a) { return a.currentTime = 0; });
        }
        else {
            utils_1.each(this._animators, function (a) { return a.currentTime = _this.duration; });
        }
        if (utils_1.isFunction(this.onfinish)) {
            this.onfinish(this);
        }
        return this;
    };
    /**
     * Plays the animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    ElementAnimator.prototype.play = function (fn) {
        utils_1.multiapply(this._animators, 'play', [], fn);
        return this;
    };
    /**
     * Pauses the animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator}  this instance of Element Animator
     */
    ElementAnimator.prototype.pause = function (fn) {
        utils_1.multiapply(this._animators, 'pause', [], fn);
        return this;
    };
    /**
     * Reverses the direction of the animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    ElementAnimator.prototype.reverse = function (fn) {
        utils_1.multiapply(this._animators, 'reverse', [], fn);
        return this;
    };
    /**
     * Cancels the animation
     *
     * @param {ja.ICallbackHandler} [fn] optional error handler
     * @returns {ja.IAnimator} this instance of Element Animator
     */
    ElementAnimator.prototype.cancel = function (fn) {
        utils_1.multiapply(this._animators, 'cancel', [], fn);
        utils_1.each(this._animators, function (a) { return a.currentTime = 0; });
        if (utils_1.isFunction(this.oncancel)) {
            this.oncancel(this);
        }
        return this;
    };
    return ElementAnimator;
}());
exports.ElementAnimator = ElementAnimator;
