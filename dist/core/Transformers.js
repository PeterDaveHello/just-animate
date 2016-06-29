"use strict";
var utils_1 = require('./utils');
var errors_1 = require('./errors');
var hyphenToPascal = /([a-z])-([a-z])/ig;
var x = 0;
var y = 1;
var z = 2;
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
function replaceCamelCased(match, p1, p2) {
    return p1 + p2.toUpperCase();
}
function transformFunction(name, params) {
    return name + "(" + utils_1.toArray(arguments, 1).join(',') + ")";
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
    // ensure first offset    
    if (first.offset !== 0) {
        first.offset = 0;
    }
    var last = keyframes[len - 1];
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
        // search for the next offset with a value        
        for (var j = i + 1; j < len; j++) {
            // pass if offset is not set
            if (!utils_1.isNumber(keyframes[j].offset)) {
                continue;
            }
            // calculate timing/position info
            var startTime = keyframes[i - 1].offset;
            var endTime = keyframes[j].offset;
            var timeDelta = endTime - startTime;
            var deltaLength = j - i + 1;
            // set the values of all keyframes between i and j (exclusive)
            for (var k = 1; k < deltaLength; k++) {
                // set to percentage of change over time delta + starting time
                keyframes[k - 1 + i].offset = ((k / j) * timeDelta) + startTime;
            }
            // move i past this keyframe since all frames between should be processed
            i = j;
            break;
        }
    }
    // fill initial keyframe with missing props
    for (var i = 1; i < len; i++) {
        var keyframe = keyframes[i];
        for (var prop in keyframe) {
            if (prop === offset || utils_1.isDefined(first[prop])) {
                continue;
            }
            first[prop] = keyframe[prop];
        }
    }
    // fill end keyframe with missing props
    for (var i = len - 2; i > -1; i--) {
        var keyframe = keyframes[i];
        for (var prop in keyframe) {
            if (prop === offset || utils_1.isDefined(last[prop])) {
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
    var scaleArray = [utils_1._, utils_1._, utils_1._];
    var skewArray = [utils_1._, utils_1._];
    var rotateArray = [utils_1._, utils_1._, utils_1._, utils_1._];
    var translateArray = [utils_1._, utils_1._, utils_1._];
    var output = {};
    for (var prop in keyframe) {
        var value = keyframe[prop];
        if (!utils_1.isDefined(value)) {
            continue;
        }
        switch (prop) {
            case scale3d:
                if (utils_1.isNumber(value)) {
                    utils_1.transfer(scaleArray, [value, value, value]);
                    continue;
                }
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        errors_1.argumentError(scale3d);
                    }
                    utils_1.transfer(scaleArray, arr);
                    continue;
                }
                errors_1.argumentError(scale3d);
            case scale:
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        errors_1.argumentError(scale);
                    }
                    utils_1.transfer(scaleArray, [arr[x], arr[y], utils_1._]);
                    continue;
                }
                if (utils_1.isNumber(value)) {
                    utils_1.transfer(scaleArray, [value, value, utils_1._]);
                    continue;
                }
                errors_1.argumentError(scale);
            case scaleX:
                if (!utils_1.isNumber(value)) {
                    errors_1.argumentError(scaleX);
                }
                scaleArray[x] = value;
                break;
            case scaleY:
                if (!utils_1.isNumber(value)) {
                    errors_1.argumentError(scaleY);
                }
                scaleArray[y] = value;
                break;
            case scaleZ:
                if (utils_1.isNumber(value)) {
                    errors_1.argumentError(scaleZ);
                }
                scaleArray[z] = value;
                break;
            case skew:
                if (utils_1.isNumber(value)) {
                    utils_1.transfer(skewArray, [value, value]);
                    continue;
                }
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length === 2) {
                        utils_1.transfer(skewArray, arr);
                    }
                    errors_1.argumentError(skew);
                    continue;
                }
                errors_1.argumentError(skew);
            case skewX:
                if (utils_1.isString(value)) {
                    skewArray[x] = value;
                    continue;
                }
                errors_1.argumentError(skewX);
            case skewY:
                if (utils_1.isString(value)) {
                    skewArray[y] = value;
                    continue;
                }
                errors_1.argumentError(skewY);
            case rotate3d:
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length === 4) {
                        utils_1.transfer(rotateArray, arr);
                    }
                }
                errors_1.argumentError(rotate3d);
            case rotateX:
                if (utils_1.isString(value)) {
                    utils_1.transfer(rotateArray, [1, 0, 0, value]);
                    continue;
                }
                errors_1.argumentError(rotateX);
            case rotateY:
                if (utils_1.isString(value)) {
                    utils_1.transfer(rotateArray, [0, 1, 0, value]);
                    continue;
                }
                errors_1.argumentError(rotateY);
            case rotate:
            case rotateZ:
                if (utils_1.isString(value)) {
                    utils_1.transfer(rotateArray, [0, 0, 1, value]);
                    continue;
                }
                errors_1.argumentError(rotateZ);
            case translate3d:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    utils_1.transfer(translateArray, [value, value, value]);
                    continue;
                }
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        errors_1.argumentError(translate3d);
                    }
                    utils_1.transfer(translateArray, arr);
                    continue;
                }
                errors_1.argumentError(translate3d);
            case translate:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    utils_1.transfer(translateArray, [value, value, utils_1._]);
                    continue;
                }
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        errors_1.argumentError(translate);
                    }
                    utils_1.transfer(translateArray, [arr[x], arr[y], utils_1._]);
                    continue;
                }
                errors_1.argumentError(translate);
            case translateX:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translateArray[x] = value;
                    continue;
                }
                errors_1.argumentError(translateX);
            case translateY:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translateArray[y] = value;
                    continue;
                }
                errors_1.argumentError(translateY);
            case translateZ:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translateArray[z] = value;
                    continue;
                }
                errors_1.argumentError(translateZ);
            case transform:
                translateArray.push(value);
                break;
            default:
                var prop2 = prop.replace(hyphenToPascal, replaceCamelCased);
                output[prop2] = value;
                break;
        }
    }
    var transformArray = [];
    if (scaleArray.some(utils_1.isDefined)) {
        transformArray[scale3d] = transformFunction(scale3d, scaleArray);
    }
    if (translateArray.some(utils_1.isDefined)) {
        translateArray[translate3d] = transformFunction(translate3d, utils_1.fill(translateArray, 0));
    }
    if (skewArray.some(utils_1.isDefined)) {
        transformArray[skew] = transformFunction(skew, utils_1.fill(skewArray, 0));
    }
    if (rotateArray.some(utils_1.isDefined)) {
        translateArray[translate3d] = transformFunction(rotate, utils_1.fill(rotateArray, 0));
    }
    if (transformArray.length) {
        output[transform] = transformArray.join(' ');
    }
    return output;
}
exports.keyframeTransformer = keyframeTransformer;
