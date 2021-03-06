"use strict";
var utils_1 = require('./utils');
var x = 0;
var y = 1;
var z = 2;
function replaceCamelCased(match, p1, p2) {
    return p1 + p2.toUpperCase();
}
/**
 * Handles converting animations options to a usable format
 */
function animationTransformer(a) {
    var keyframes = utils_1.map(a.keyframes, keyframeTransformer);
    return {
        keyframes: normalizeKeyframes(keyframes),
        name: a.name,
        timings: utils_1.extend({}, a.timings)
    };
}
exports.animationTransformer = animationTransformer;
/**
 * If a property is missing at the start or end keyframe, the first or last instance of it is moved to the end.
 */
function normalizeKeyframes(keyframes) {
    var len = keyframes.length;
    // don't attempt to fill animation if less than 2 keyframes
    if (len < 2) {
        return keyframes;
    }
    var first = keyframes[0];
    var last = keyframes[len - 1];
    // ensure first offset    
    if (first.offset !== 0) {
        first.offset = 0;
    }
    // ensure last offset
    if (last.offset !== 1) {
        last.offset = 1;
    }
    // explicitly set implicit offsets
    var lasti = len - 1;
    for (var i = 1; i < lasti; i++) {
        var target = keyframes[i];
        // skip entries that have an offset        
        if (utils_1.isNumber(target.offset)) {
            continue;
        }
        for (var j = i + 1; j < len; j++) {
            // skip if offset is not set
            if (!utils_1.isNumber(keyframes[j].offset)) {
                continue;
            }
            // find the value of the offset
            var startTime = keyframes[i - 1].offset;
            var endTime = keyframes[j].offset;
            var timeDelta = endTime - startTime;
            var deltaLength = j - i + 1;
            for (var k = 1; k < deltaLength; k++) {
                // percentage of change over time delta + starting time
                keyframes[k - 1 + i].offset = ((k / j) * timeDelta) + startTime;
            }
            // move the i past this keyframe since all frames between should be processed
            i = j;
            break;
        }
    }
    // fill initial keyframe with missing props
    for (var i = 1; i < len; i++) {
        var keyframe = keyframes[i];
        for (var prop in keyframe) {
            if (prop === 'offset' || utils_1.isDefined(first[prop])) {
                continue;
            }
            first[prop] = keyframe[prop];
        }
    }
    // fill end keyframe with missing props
    for (var i = len - 2; i > -1; i--) {
        var keyframe = keyframes[i];
        for (var prop in keyframe) {
            if (prop === 'offset' || utils_1.isDefined(last[prop])) {
                continue;
            }
            last[prop] = keyframe[prop];
        }
    }
    return keyframes;
}
exports.normalizeKeyframes = normalizeKeyframes;
/**
 * Handles transforming short hand key properties into their native form
 */
function keyframeTransformer(keyframe) {
    // transform properties
    var scale = new Array(3);
    var skew = new Array(2);
    var translate = new Array(3);
    var output = {};
    var transform = '';
    for (var prop in keyframe) {
        var value = keyframe[prop];
        if (value === undefined || value === null /* tslint:enable */ || value === '') {
            continue;
        }
        switch (prop) {
            case 'scale3d':
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        throw Error('scale3d requires x, y, & z');
                    }
                    scale[x] = arr[x];
                    scale[y] = arr[y];
                    scale[z] = arr[z];
                    continue;
                }
                if (utils_1.isNumber(value)) {
                    scale[x] = value;
                    scale[y] = value;
                    scale[z] = value;
                    continue;
                }
                throw Error('scale3d requires a number or number[]');
            case 'scale':
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        throw Error('scale requires x & y');
                    }
                    scale[x] = arr[x];
                    scale[y] = arr[y];
                    continue;
                }
                if (utils_1.isNumber(value)) {
                    scale[x] = value;
                    scale[y] = value;
                    continue;
                }
                throw Error('scale requires a number or number[]');
            case 'scaleX':
                if (utils_1.isNumber(value)) {
                    scale[x] = value;
                    continue;
                }
                throw Error('scaleX requires a number');
            case 'scaleY':
                if (utils_1.isNumber(value)) {
                    scale[y] = value;
                    continue;
                }
                throw Error('scaleY requires a number');
            case 'scaleZ':
                if (utils_1.isNumber(value)) {
                    scale[z] = value;
                    continue;
                }
                throw Error('scaleZ requires a number');
            case 'skew':
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        throw Error('skew requires x & y');
                    }
                    skew[x] = arr[x];
                    skew[y] = arr[y];
                    continue;
                }
                if (utils_1.isNumber(value)) {
                    skew[x] = value;
                    skew[y] = value;
                    continue;
                }
                throw Error('skew requires a number, string, string[], or number[]');
            case 'skewX':
                if (utils_1.isString(value)) {
                    skew[x] = value;
                    continue;
                }
                throw Error('skewX requires a number or string');
            case 'skewY':
                if (utils_1.isString(value)) {
                    skew[y] = value;
                    continue;
                }
                throw Error('skewY requires a number or string');
            case 'rotate3d':
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 4) {
                        throw Error('rotate3d requires x, y, z, & a');
                    }
                    transform += " rotate3d(" + arr[0] + "," + arr[1] + "," + arr[2] + "," + arr[3] + ")";
                    continue;
                }
                throw Error('rotate3d requires an []');
            case 'rotateX':
                if (utils_1.isString(value)) {
                    transform += " rotate3d(1, 0, 0, " + value + ")";
                    continue;
                }
                throw Error('rotateX requires a string');
            case 'rotateY':
                if (utils_1.isString(value)) {
                    transform += " rotate3d(0, 1, 0, " + value + ")";
                    continue;
                }
                throw Error('rotateY requires a string');
            case 'rotate':
            case 'rotateZ':
                if (utils_1.isString(value)) {
                    transform += " rotate3d(0, 0, 1, " + value + ")";
                    continue;
                }
                throw Error('rotateZ requires a string');
            case 'translate3d':
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        throw Error('translate3d requires x, y, & z');
                    }
                    translate[x] = arr[x];
                    translate[y] = arr[y];
                    translate[z] = arr[z];
                    continue;
                }
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translate[x] = value;
                    translate[y] = value;
                    translate[z] = value;
                    continue;
                }
                throw Error('translate3d requires a number, string, string[], or number[]');
            case 'translate':
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        throw Error('translate requires x & y');
                    }
                    translate[x] = arr[x];
                    translate[y] = arr[y];
                    continue;
                }
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translate[x] = value;
                    translate[y] = value;
                    continue;
                }
                throw Error('translate requires a number, string, string[], or number[]');
            case 'translateX':
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translate[x] = value;
                    continue;
                }
                throw Error('translateX requires a number or string');
            case 'translateY':
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translate[y] = value;
                    continue;
                }
                throw Error('translateY requires a number or string');
            case 'translateZ':
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translate[z] = value;
                    continue;
                }
                throw Error('translateZ requires a number or string');
            case 'transform':
                transform += ' ' + value;
                break;
            default:
                var prop2 = prop.replace(/([a-z])-([a-z])/ig, replaceCamelCased);
                output[prop2] = value;
                break;
        }
    }
    // combine scale
    var isScaleX = scale[x] !== undefined;
    var isScaleY = scale[y] !== undefined;
    var isScaleZ = scale[z] !== undefined;
    if (isScaleX && isScaleZ || isScaleY && isScaleZ) {
        var scaleString = scale.map(function (s) { return s || '1'; }).join(',');
        transform += " scale3d(" + scaleString + ")";
    }
    else if (isScaleX && isScaleY) {
        transform += " scale(" + (scale[x] || 1) + ", " + (scale[y] || 1) + ")";
    }
    else if (isScaleX) {
        transform += " scaleX(" + scale[x] + ")";
    }
    else if (isScaleY) {
        transform += " scaleX(" + scale[y] + ")";
    }
    else if (isScaleZ) {
        transform += " scaleX(" + scale[z] + ")";
    }
    else {
    }
    // combine skew
    var isskewX = skew[x] !== undefined;
    var isskewY = skew[y] !== undefined;
    if (isskewX && isskewY) {
        transform += " skew(" + (skew[x] || 1) + ", " + (skew[y] || 1) + ")";
    }
    else if (isskewX) {
        transform += " skewX(" + skew[x] + ")";
    }
    else if (isskewY) {
        transform += " skewX(" + skew[y] + ")";
    }
    else {
    }
    // combine translate
    var istranslateX = translate[x] !== undefined;
    var istranslateY = translate[y] !== undefined;
    var istranslateZ = translate[z] !== undefined;
    if (istranslateX && istranslateZ || istranslateY && istranslateZ) {
        var translateString = translate.map(function (s) { return s || '1'; }).join(',');
        transform += " translate3d(" + translateString + ")";
    }
    else if (istranslateX && istranslateY) {
        transform += " translate(" + (translate[x] || 1) + ", " + (translate[y] || 1) + ")";
    }
    else if (istranslateX) {
        transform += " translateX(" + translate[x] + ")";
    }
    else if (istranslateY) {
        transform += " translateX(" + translate[y] + ")";
    }
    else if (istranslateZ) {
        transform += " translateX(" + translate[z] + ")";
    }
    else {
    }
    if (transform) {
        output['transform'] = transform;
    }
    return output;
}
exports.keyframeTransformer = keyframeTransformer;
