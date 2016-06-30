(function () {
    'use strict';

    var ostring = Object.prototype.toString;
    var slice = Array.prototype.slice;
    var _ = undefined;
    function noop() {
    }
    function transformFunction(name, params) {
        return name + "(" + toArray(arguments, 1).join(',') + ")";
    }
    function replaceCamelCased(match, p1, p2) {
        return p1 + p2.toUpperCase();
    }
    function transfer(target, source) {
        for (var i = 0, len = target.length; i < len; i++) {
            var val = source[i];
            if (val !== _) {
                target[i] = source[i];
            }
        }
        return target;
    }
    function fill(target, emptyVal, force) {
        for (var i = 0, len = target.length; i < len; i++) {
            var val = target[i];
            if (force || val === _) {
                target[i] = emptyVal;
            }
        }
        return target;
    }
    function head(indexed) {
        return (!indexed || indexed.length < 1) ? _ : indexed[0];
    }
    function isArray(a) {
        return !isString(a) && isNumber(a.length);
    }
    function isDefined(a) {
        return a !== _ && a !== null && a !== '';
    }
    function isFunction(a) {
        return ostring.call(a) === '[object Function]';
    }
    function isNumber(a) {
        return typeof a === 'number';
    }
    function isString(a) {
        return typeof a === 'string';
    }
    function toArray(indexed, start) {
        return slice.call(indexed, start || 0);
    }
    function each(items, fn) {
        for (var i = 0, len = items.length; i < len; i++) {
            fn(items[i]);
        }
    }
    function max(items, propertyName) {
        var max = '';
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var prop = item[propertyName];
            if (max < prop) {
                max = prop;
            }
        }
        return max;
    }
    function map(items, fn) {
        var results = [];
        for (var i = 0, len = items.length; i < len; i++) {
            var result = fn(items[i]);
            if (isDefined(result)) {
                results.push(result);
            }
        }
        return results;
    }
    function extend(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        for (var i = 1, len = arguments.length; i < len; i++) {
            var source = arguments[i];
            for (var propName in source) {
                target[propName] = source[propName];
            }
        }
        return target;
    }
    function multiapply(targets, fnName, args, cb) {
        var errors = [];
        var results = [];
        for (var i = 0, len = targets.length; i < len; i++) {
            try {
                var target = targets[i];
                var result = void 0;
                if (fnName) {
                    result = target[fnName].apply(target, args);
                }
                else {
                    result = target.apply(_, args);
                }
                if (isDefined(result)) {
                    results.push(result);
                }
            }
            catch (err) {
                errors.push(err);
            }
        }
        if (isFunction(cb)) {
            cb(errors);
        }
        return results;
    }

    function argumentError(name) {
        throw new Error("invalid parameter: " + name);
    }

    var hyphenToPascal = /([a-z])-([a-z])/ig;
    var x = 0;
    var y = 1;
    var z = 2;
    var cubicBezier = 'cubic-bezier';
    var duration = 'duration';
    var offset = 'offset';
    var scale3d = 'scale3d';
    var scale = 'scale';
    var scaleX = 'scaleX';
    var scaleY = 'scaleY';
    var scaleZ = 'scaleZ';
    var skew = 'skew';
    var skewX = 'skewX';
    var skewY = 'skewY';
    var rotate3d = 'rotate3d';
    var rotate = 'rotate';
    var rotateX = 'rotateX';
    var rotateY = 'rotateY';
    var rotateZ = 'rotateZ';
    var translate3d = 'translate3d';
    var translate = 'translate';
    var translateX = 'translateX';
    var translateY = 'translateY';
    var translateZ = 'translateZ';
    var transform = 'transform';

    function animationTransformer(a) {
        var keyframes = map(a.keyframes, keyframeTransformer);
        return {
            keyframes: normalizeKeyframes(keyframes),
            name: a.name,
            timings: extend({}, a.timings)
        };
    }
    function normalizeKeyframes(keyframes) {
        var len = keyframes.length;
        if (len < 2) {
            return keyframes;
        }
        var first = keyframes[0];
        if (first.offset !== 0) {
            first.offset = 0;
        }
        var last = keyframes[len - 1];
        if (last.offset !== 1) {
            last.offset = 1;
        }
        var lasti = len - 1;
        for (var i = 1; i < lasti; i++) {
            var target = keyframes[i];
            if (isNumber(target.offset)) {
                continue;
            }
            for (var j = i + 1; j < len; j++) {
                if (!isNumber(keyframes[j].offset)) {
                    continue;
                }
                var startTime = keyframes[i - 1].offset;
                var endTime = keyframes[j].offset;
                var timeDelta = endTime - startTime;
                var deltaLength = j - i + 1;
                for (var k = 1; k < deltaLength; k++) {
                    keyframes[k - 1 + i].offset = ((k / j) * timeDelta) + startTime;
                }
                i = j;
                break;
            }
        }
        for (var i = 1; i < len; i++) {
            var keyframe = keyframes[i];
            for (var prop in keyframe) {
                if (prop === offset || isDefined(first[prop])) {
                    continue;
                }
                first[prop] = keyframe[prop];
            }
        }
        for (var i = len - 2; i > -1; i--) {
            var keyframe = keyframes[i];
            for (var prop in keyframe) {
                if (prop === offset || isDefined(last[prop])) {
                    continue;
                }
                last[prop] = keyframe[prop];
            }
        }
        return keyframes;
    }
    function keyframeTransformer(keyframe) {
        var scaleArray = [_, _, _];
        var skewArray = [_, _];
        var rotateArray = [_, _, _, _];
        var translateArray = [_, _, _];
        var output = {};
        for (var prop in keyframe) {
            var value = keyframe[prop];
            if (!isDefined(value)) {
                continue;
            }
            switch (prop) {
                case transform:
                    output[prop] = value;
                    continue;
                case scale3d:
                    if (isNumber(value)) {
                        transfer(scaleArray, [value, value, value]);
                        continue;
                    }
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 3) {
                            argumentError(scale3d);
                        }
                        transfer(scaleArray, arr);
                        continue;
                    }
                    argumentError(scale3d);
                case scale:
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 2) {
                            argumentError(scale);
                        }
                        transfer(scaleArray, [arr[x], arr[y], _]);
                        continue;
                    }
                    if (isNumber(value)) {
                        transfer(scaleArray, [value, value, _]);
                        continue;
                    }
                    argumentError(scale);
                case scaleX:
                    if (!isNumber(value)) {
                        argumentError(scaleX);
                    }
                    scaleArray[x] = value;
                    continue;
                case scaleY:
                    if (!isNumber(value)) {
                        argumentError(scaleY);
                    }
                    scaleArray[y] = value;
                    continue;
                case scaleZ:
                    if (isNumber(value)) {
                        argumentError(scaleZ);
                    }
                    scaleArray[z] = value;
                    continue;
                case skew:
                    if (isNumber(value)) {
                        transfer(skewArray, [value, value]);
                        continue;
                    }
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length === 2) {
                            transfer(skewArray, arr);
                        }
                        argumentError(skew);
                        continue;
                    }
                    argumentError(skew);
                case skewX:
                    if (isString(value)) {
                        skewArray[x] = value;
                        continue;
                    }
                    argumentError(skewX);
                case skewY:
                    if (isString(value)) {
                        skewArray[y] = value;
                        continue;
                    }
                    argumentError(skewY);
                case rotate3d:
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length === 4) {
                            transfer(rotateArray, arr);
                        }
                    }
                    argumentError(rotate3d);
                case rotateX:
                    if (isString(value)) {
                        transfer(rotateArray, [1, 0, 0, value]);
                        continue;
                    }
                    argumentError(rotateX);
                case rotateY:
                    if (isString(value)) {
                        transfer(rotateArray, [0, 1, 0, value]);
                        continue;
                    }
                    argumentError(rotateY);
                case rotate:
                case rotateZ:
                    if (isString(value)) {
                        transfer(rotateArray, [0, 0, 1, value]);
                        continue;
                    }
                    argumentError(rotateZ);
                case translate3d:
                    if (isString(value) || isNumber(value)) {
                        transfer(translateArray, [value, value, value]);
                        continue;
                    }
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 3) {
                            argumentError(translate3d);
                        }
                        transfer(translateArray, arr);
                        continue;
                    }
                    argumentError(translate3d);
                case translate:
                    if (isString(value) || isNumber(value)) {
                        transfer(translateArray, [value, value, _]);
                        continue;
                    }
                    if (isArray(value)) {
                        var arr = value;
                        if (arr.length !== 2) {
                            argumentError(translate);
                        }
                        transfer(translateArray, [arr[x], arr[y], _]);
                        continue;
                    }
                    argumentError(translate);
                case translateX:
                    if (isString(value) || isNumber(value)) {
                        translateArray[x] = value;
                        continue;
                    }
                    argumentError(translateX);
                case translateY:
                    if (isString(value) || isNumber(value)) {
                        translateArray[y] = value;
                        continue;
                    }
                    argumentError(translateY);
                case translateZ:
                    if (isString(value) || isNumber(value)) {
                        translateArray[z] = value;
                        continue;
                    }
                    argumentError(translateZ);
                default:
                    var prop2 = prop.replace(hyphenToPascal, replaceCamelCased);
                    output[prop2] = value;
                    continue;
            }
        }
        var transformArray = [];
        if (scaleArray.some(isDefined)) {
            transformArray.push(transformFunction(scale3d, scaleArray));
        }
        if (translateArray.some(isDefined)) {
            transformArray.push(transformFunction(translate3d, fill(translateArray, 0)));
        }
        if (skewArray.some(isDefined)) {
            transformArray.push(transformFunction(skew, fill(skewArray, 0)));
        }
        if (rotateArray.some(isDefined)) {
            transformArray.push(transformFunction(rotate3d, fill(rotateArray, 0)));
        }
        if (transformArray.length) {
            output[transform] = transformArray.join(' ');
        }
        return output;
    }

    var cubicEasings = {
        easeInBack: [0.600, -0.280, 0.735, 0.045],
        easeInCirc: [0.600, 0.040, 0.980, 0.335],
        easeInCubic: [0.550, 0.055, 0.675, 0.190],
        easeInExpo: [0.950, 0.050, 0.795, 0.035],
        easeInOutBack: [0.680, -0.550, 0.265, 1.550],
        easeInOutCirc: [0.785, 0.135, 0.150, 0.860],
        easeInOutCubic: [0.645, 0.045, 0.355, 1.000],
        easeInOutExpo: [1.000, 0.000, 0.000, 1.000],
        easeInOutQuad: [0.455, 0.030, 0.515, 0.955],
        easeInOutQuart: [0.770, 0.000, 0.175, 1.000],
        easeInOutQuint: [0.860, 0.000, 0.070, 1.000],
        easeInOutSine: [0.445, 0.050, 0.550, 0.950],
        easeInQuad: [0.550, 0.085, 0.680, 0.530],
        easeInQuart: [0.895, 0.030, 0.685, 0.220],
        easeInQuint: [0.755, 0.050, 0.855, 0.060],
        easeInSine: [0.470, 0.000, 0.745, 0.715],
        easeOutBack: [0.175, 0.885, 0.320, 1.275],
        easeOutCirc: [0.075, 0.820, 0.165, 1.000],
        easeOutCubic: [0.215, 0.610, 0.355, 1.000],
        easeOutExpo: [0.190, 1.000, 0.220, 1.000],
        easeOutQuad: [0.250, 0.460, 0.450, 0.940],
        easeOutQuart: [0.165, 0.840, 0.440, 1.000],
        easeOutQuint: [0.230, 1.000, 0.320, 1.000],
        easeOutSine: [0.390, 0.575, 0.565, 1.000],
        elegantSlowStartEnd: [0.175, 0.885, 0.320, 1.275]
    };

    function resolveElements(source) {
        if (!source) {
            throw Error('missing elements');
        }
        if (isString(source)) {
            var nodeResults = document.querySelectorAll(source);
            return toArray(nodeResults);
        }
        if (source instanceof Element) {
            return [source];
        }
        if (isFunction(source)) {
            var provider = source;
            var result = provider();
            return resolveElements(result);
        }
        if (isArray(source)) {
            var elements_1 = [];
            each(source, function (i) {
                var innerElements = resolveElements(i);
                elements_1.push.apply(elements_1, innerElements);
            });
            return elements_1;
        }
        return [];
    }

    var ElementAnimator = (function () {
        function ElementAnimator(manager, keyframesOrName, el, timings) {
            var _this = this;
            if (!keyframesOrName) {
                return;
            }
            var keyframes;
            if (isString(keyframesOrName)) {
                var definition = manager.findAnimation(keyframesOrName);
                keyframes = definition.keyframes;
                timings = extend({}, definition.timings, timings);
            }
            else {
                keyframes = normalizeKeyframes(map(keyframesOrName, keyframeTransformer));
            }
            if (timings && timings.easing) {
                var cubicEasing = cubicEasings[timings.easing];
                if (cubicEasing) {
                    timings.easing = transformFunction(cubicBezier, cubicEasing);
                }
            }
            this.duration = timings.duration;
            var elements = resolveElements(el);
            this._animators = multiapply(elements, 'animate', [keyframes, timings]);
            if (this._animators.length > 0) {
                this._animators[0].onfinish = function () {
                    _this.finish();
                };
            }
        }
        Object.defineProperty(ElementAnimator.prototype, "playbackRate", {
            get: function () {
                var first = head(this._animators);
                return first ? first.playbackRate : 0;
            },
            set: function (val) {
                each(this._animators, function (a) { return a.playbackRate = val; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementAnimator.prototype, "currentTime", {
            get: function () {
                return max(this._animators, 'currentTime') || 0;
            },
            set: function (elapsed) {
                each(this._animators, function (a) { return a.currentTime = elapsed; });
            },
            enumerable: true,
            configurable: true
        });
        ElementAnimator.prototype.finish = function (fn) {
            var _this = this;
            multiapply(this._animators, 'finish', [], fn);
            if (this.playbackRate < 0) {
                each(this._animators, function (a) { return a.currentTime = 0; });
            }
            else {
                each(this._animators, function (a) { return a.currentTime = _this.duration; });
            }
            if (isFunction(this.onfinish)) {
                this.onfinish(this);
            }
            return this;
        };
        ElementAnimator.prototype.play = function (fn) {
            multiapply(this._animators, 'play', [], fn);
            return this;
        };
        ElementAnimator.prototype.pause = function (fn) {
            multiapply(this._animators, 'pause', [], fn);
            return this;
        };
        ElementAnimator.prototype.reverse = function (fn) {
            multiapply(this._animators, 'reverse', [], fn);
            return this;
        };
        ElementAnimator.prototype.cancel = function (fn) {
            multiapply(this._animators, 'cancel', [], fn);
            each(this._animators, function (a) { return a.currentTime = 0; });
            if (isFunction(this.oncancel)) {
                this.oncancel(this);
            }
            return this;
        };
        return ElementAnimator;
    }());

    var SequenceAnimator = (function () {
        function SequenceAnimator(manager, options) {
            var steps = map(options.steps, function (step) {
                if (step.command || !step.name) {
                    return step;
                }
                var definition = manager.findAnimation(step.name);
                var timings = extend({}, definition.timings);
                if (step.timings) {
                    timings = extend(timings, step.timings);
                }
                return {
                    el: step.el,
                    keyframes: definition.keyframes,
                    timings: definition.timings
                };
            });
            this.onfinish = noop;
            this._currentIndex = -1;
            this._manager = manager;
            this._steps = steps;
            if (options.autoplay === true) {
                this.play();
            }
        }
        Object.defineProperty(SequenceAnimator.prototype, "currentTime", {
            get: function () {
                var currentIndex = this._currentIndex;
                var len = this._steps.length;
                if (currentIndex === -1 || currentIndex === len) {
                    return 0;
                }
                var isReversed = this.playbackRate === -1;
                var beforeTime = 0;
                var afterTime = 0;
                var currentTime;
                for (var i = 0; i < len; i++) {
                    var step = this._steps[i];
                    if (i < currentIndex) {
                        beforeTime += step.timings.duration;
                        continue;
                    }
                    if (i > currentIndex) {
                        afterTime += step.timings.duration;
                        continue;
                    }
                    if (isReversed) {
                        currentTime = this.duration - step.animator.currentTime;
                        continue;
                    }
                    currentTime = step.animator.currentTime;
                }
                return currentTime + (isReversed ? afterTime : beforeTime);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SequenceAnimator.prototype, "duration", {
            get: function () {
                return this._steps.reduce(function (c, n) { return c + (n.timings.duration || 0); }, 0);
            },
            enumerable: true,
            configurable: true
        });
        SequenceAnimator.prototype.finish = function (fn) {
            this._errorCallback = fn;
            this._currentIndex = -1;
            for (var x = 0; x < this._steps.length; x++) {
                var step = this._steps[x];
                if (isDefined(step.animator)) {
                    step.animator.cancel(fn);
                }
            }
            if (isFunction(this.onfinish)) {
                this.onfinish(this);
            }
            return this;
        };
        SequenceAnimator.prototype.play = function (fn) {
            this._errorCallback = fn;
            this.playbackRate = 1;
            this._playThisStep();
            return this;
        };
        SequenceAnimator.prototype.pause = function (fn) {
            this._errorCallback = fn;
            if (!this._isInEffect()) {
                return this;
            }
            var animator = this._getAnimator();
            animator.pause(fn);
            return this;
        };
        SequenceAnimator.prototype.reverse = function (fn) {
            this._errorCallback = fn;
            this.playbackRate = -1;
            this._playThisStep();
            return this;
        };
        SequenceAnimator.prototype.cancel = function (fn) {
            this._errorCallback = fn;
            this.playbackRate = _;
            this._currentIndex = -1;
            for (var x = 0; x < this._steps.length; x++) {
                var step = this._steps[x];
                if (isDefined(step.animator)) {
                    step.animator.cancel(fn);
                }
            }
            if (isFunction(this.oncancel)) {
                this.oncancel(this);
            }
            return this;
        };
        SequenceAnimator.prototype._isInEffect = function () {
            return this._currentIndex > -1 && this._currentIndex < this._steps.length;
        };
        SequenceAnimator.prototype._getAnimator = function () {
            var it = this._steps[this._currentIndex];
            if (it.animator) {
                return it.animator;
            }
            it.animator = this._manager.animate(it.keyframes, it.el, it.timings);
            return it.animator;
        };
        SequenceAnimator.prototype._playNextStep = function (evt) {
            this._currentIndex += this.playbackRate === -1 ? -1 : 1;
            if (this._isInEffect()) {
                this._playThisStep();
            }
            else {
                this.onfinish(evt);
            }
        };
        SequenceAnimator.prototype._playThisStep = function () {
            var _this = this;
            if (!this._isInEffect()) {
                this._currentIndex = this.playbackRate === -1
                    ? this._steps.length - 1
                    : 0;
            }
            var animator = this._getAnimator();
            animator.onfinish = function (evt) {
                _this._playNextStep(evt);
            };
            animator.play(this._errorCallback);
        };
        return SequenceAnimator;
    }());

    var animationPadding = 1.0 / 30;
    var TimelineAnimator = (function () {
        function TimelineAnimator(manager, options) {
            var durationMs = options.duration;
            if (!isDefined(durationMs)) {
                argumentError(duration);
            }
            this.playbackRate = 0;
            this.duration = options.duration;
            this.currentTime = 0;
            this._events = map(options.events, function (evt) { return new TimelineEvent(manager, durationMs, evt); });
            this._isPaused = false;
            this._manager = manager;
            this._tick = this._tick.bind(this);
            if (options.autoplay) {
                this.play();
            }
        }
        TimelineAnimator.prototype.finish = function (fn) {
            this._isFinished = true;
            return this;
        };
        TimelineAnimator.prototype.play = function (fn) {
            this.playbackRate = 1;
            this._isPaused = false;
            if (this._isInEffect) {
                return this;
            }
            if (this.playbackRate < 0) {
                this.currentTime = this.duration;
            }
            else {
                this.currentTime = 0;
            }
            window.requestAnimationFrame(this._tick);
            return this;
        };
        TimelineAnimator.prototype.pause = function (fn) {
            if (this._isInEffect) {
                this._isPaused = true;
            }
            return this;
        };
        TimelineAnimator.prototype.reverse = function (fn) {
            this.playbackRate = -1;
            this._isPaused = false;
            if (this._isInEffect) {
                return this;
            }
            if (this.currentTime <= 0) {
                this.currentTime = this.duration;
            }
            window.requestAnimationFrame(this._tick);
            return this;
        };
        TimelineAnimator.prototype.cancel = function (fn) {
            this.playbackRate = 0;
            this._isCanceled = true;
            return this;
        };
        TimelineAnimator.prototype._tick = function () {
            var _this = this;
            if (this._isCanceled) {
                this._triggerCancel();
                return;
            }
            if (this._isFinished) {
                this._triggerFinish();
                return;
            }
            if (this._isPaused) {
                this._triggerPause();
                return;
            }
            if (!this._isInEffect) {
                this._isInEffect = true;
            }
            var thisTick = performance.now();
            var lastTick = this._lastTick;
            if (isDefined(lastTick)) {
                var delta = (thisTick - lastTick) * this.playbackRate;
                this.currentTime += delta;
            }
            this._lastTick = thisTick;
            if (this.currentTime > this.duration || this.currentTime < 0) {
                this._triggerFinish();
                return;
            }
            each(this._events, function (evt) {
                var startTimeMs = _this.playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
                var endTimeMs = _this.playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
                var shouldBeActive = startTimeMs <= _this.currentTime && _this.currentTime < endTimeMs;
                if (!shouldBeActive) {
                    evt.isInEffect = false;
                    return;
                }
                evt.animator.playbackRate = _this.playbackRate;
                evt.isInEffect = true;
                evt.animator.play();
            });
            window.requestAnimationFrame(this._tick);
        };
        TimelineAnimator.prototype._triggerFinish = function () {
            this._reset();
            each(this._events, function (evt) { return evt.animator.finish(); });
            if (isFunction(this.onfinish)) {
                this.onfinish(this);
            }
        };
        TimelineAnimator.prototype._triggerCancel = function () {
            this._reset();
            each(this._events, function (evt) { return evt.animator.cancel(); });
            if (isFunction(this.oncancel)) {
                this.oncancel(this);
            }
        };
        TimelineAnimator.prototype._triggerPause = function () {
            this._isPaused = true;
            this._isInEffect = false;
            this._lastTick = _;
            this.playbackRate = 0;
            each(this._events, function (evt) {
                evt.isInEffect = false;
                evt.animator.pause();
            });
        };
        TimelineAnimator.prototype._reset = function () {
            this.currentTime = 0;
            this._lastTick = _;
            this._isCanceled = false;
            this._isFinished = false;
            this._isPaused = false;
            this._isInEffect = false;
            each(this._events, function (evt) {
                evt.isInEffect = false;
            });
        };
        return TimelineAnimator;
    }());
    var TimelineEvent = (function () {
        function TimelineEvent(manager, timelineDuration, evt) {
            var keyframes;
            var timings;
            var el;
            if (evt.name) {
                var definition = manager.findAnimation(evt.name);
                var timings2 = extend({}, definition.timings);
                if (evt.timings) {
                    timings = extend(timings2, evt.timings);
                }
                keyframes = definition.keyframes;
                timings = timings2;
                el = evt.el;
            }
            else {
                keyframes = evt.keyframes;
                timings = evt.timings;
                el = evt.el;
            }
            var startTime = timelineDuration * evt.offset;
            var endTime = startTime + timings.duration;
            var isClipped = endTime > timelineDuration;
            if (isClipped) {
                endTime = timelineDuration;
            }
            this.el = el;
            this.isClipped = isClipped;
            this.isInEffect = false;
            this.endTimeMs = endTime;
            this.keyframes = keyframes;
            this.offset = evt.offset;
            this.startTimeMs = startTime;
            this.timings = timings;
            this._manager = manager;
        }
        Object.defineProperty(TimelineEvent.prototype, "animator", {
            get: function () {
                if (!isDefined(this._animator)) {
                    this._animator = this._manager.animate(this.keyframes, this.el, this.timings);
                    this._animator.pause();
                }
                return this._animator;
            },
            enumerable: true,
            configurable: true
        });
        return TimelineEvent;
    }());

    var DEFAULT_ANIMATIONS = [];
    var JustAnimate = (function () {
        function JustAnimate() {
            var _this = this;
            this._registry = {};
            each(DEFAULT_ANIMATIONS, function (a) { return _this._registry[a.name] = a; });
        }
        JustAnimate.inject = function (animations) {
            Array.prototype.push.apply(DEFAULT_ANIMATIONS, map(animations, animationTransformer));
        };
        JustAnimate.prototype.animate = function (keyframesOrName, el, timings) {
            return new ElementAnimator(this, keyframesOrName, el, timings);
        };
        JustAnimate.prototype.animateSequence = function (options) {
            return new SequenceAnimator(this, options);
        };
        JustAnimate.prototype.animateTimeline = function (options) {
            return new TimelineAnimator(this, options);
        };
        JustAnimate.prototype.findAnimation = function (name) {
            return this._registry[name] || undefined;
        };
        JustAnimate.prototype.register = function (animationOptions) {
            this._registry[animationOptions.name] = animationTransformer(animationOptions);
            return this;
        };
        return JustAnimate;
    }());

    if (typeof angular !== 'undefined') {
        angular.module('just.animate', []).service('just', JustAnimate);
    }
    var animationManager = undefined;
    function getManager() {
        if (!isDefined(animationManager)) {
            animationManager = new JustAnimate();
        }
        return animationManager;
    }
    var just = {
        animate: function (keyframesOrName, el, timings) {
            return getManager().animate(keyframesOrName, el, timings);
        },
        animateSequence: function (options) {
            return getManager().animateSequence(options);
        },
        animateTimeline: function (options) {
            return getManager().animateTimeline(options);
        },
        findAnimation: function (name) {
            return getManager().findAnimation(name);
        },
        inject: function (animations) {
            JustAnimate.inject(animations);
        },
        register: function (animationOptions) {
            return getManager().register(animationOptions);
        }
    };
    window.Just = just;

}());