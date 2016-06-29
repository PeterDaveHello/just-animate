"use strict";
var utils_1 = require('./utils');
var errors_1 = require('./errors');
var literals_1 = require('./literals');
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
            if (prop === literals_1.offset || utils_1.isDefined(first[prop])) {
                continue;
            }
            first[prop] = keyframe[prop];
        }
    }
    // fill end keyframe with missing props
    for (var i = len - 2; i > -1; i--) {
        var keyframe = keyframes[i];
        for (var prop in keyframe) {
            if (prop === literals_1.offset || utils_1.isDefined(last[prop])) {
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
            case literals_1.scale3d:
                if (utils_1.isNumber(value)) {
                    utils_1.transfer(scaleArray, [value, value, value]);
                    continue;
                }
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        errors_1.argumentError(literals_1.scale3d);
                    }
                    utils_1.transfer(scaleArray, arr);
                    continue;
                }
                errors_1.argumentError(literals_1.scale3d);
            case literals_1.scale:
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        errors_1.argumentError(literals_1.scale);
                    }
                    utils_1.transfer(scaleArray, [arr[literals_1.x], arr[literals_1.y], utils_1._]);
                    continue;
                }
                if (utils_1.isNumber(value)) {
                    utils_1.transfer(scaleArray, [value, value, utils_1._]);
                    continue;
                }
                errors_1.argumentError(literals_1.scale);
            case literals_1.scaleX:
                if (!utils_1.isNumber(value)) {
                    errors_1.argumentError(literals_1.scaleX);
                }
                scaleArray[literals_1.x] = value;
                break;
            case literals_1.scaleY:
                if (!utils_1.isNumber(value)) {
                    errors_1.argumentError(literals_1.scaleY);
                }
                scaleArray[literals_1.y] = value;
                break;
            case literals_1.scaleZ:
                if (utils_1.isNumber(value)) {
                    errors_1.argumentError(literals_1.scaleZ);
                }
                scaleArray[literals_1.z] = value;
                break;
            case literals_1.skew:
                if (utils_1.isNumber(value)) {
                    utils_1.transfer(skewArray, [value, value]);
                    continue;
                }
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length === 2) {
                        utils_1.transfer(skewArray, arr);
                    }
                    errors_1.argumentError(literals_1.skew);
                    continue;
                }
                errors_1.argumentError(literals_1.skew);
            case literals_1.skewX:
                if (utils_1.isString(value)) {
                    skewArray[literals_1.x] = value;
                    continue;
                }
                errors_1.argumentError(literals_1.skewX);
            case literals_1.skewY:
                if (utils_1.isString(value)) {
                    skewArray[literals_1.y] = value;
                    continue;
                }
                errors_1.argumentError(literals_1.skewY);
            case literals_1.rotate3d:
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length === 4) {
                        utils_1.transfer(rotateArray, arr);
                    }
                }
                errors_1.argumentError(literals_1.rotate3d);
            case literals_1.rotateX:
                if (utils_1.isString(value)) {
                    utils_1.transfer(rotateArray, [1, 0, 0, value]);
                    continue;
                }
                errors_1.argumentError(literals_1.rotateX);
            case literals_1.rotateY:
                if (utils_1.isString(value)) {
                    utils_1.transfer(rotateArray, [0, 1, 0, value]);
                    continue;
                }
                errors_1.argumentError(literals_1.rotateY);
            case literals_1.rotate:
            case literals_1.rotateZ:
                if (utils_1.isString(value)) {
                    utils_1.transfer(rotateArray, [0, 0, 1, value]);
                    continue;
                }
                errors_1.argumentError(literals_1.rotateZ);
            case literals_1.translate3d:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    utils_1.transfer(translateArray, [value, value, value]);
                    continue;
                }
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 3) {
                        errors_1.argumentError(literals_1.translate3d);
                    }
                    utils_1.transfer(translateArray, arr);
                    continue;
                }
                errors_1.argumentError(literals_1.translate3d);
            case literals_1.translate:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    utils_1.transfer(translateArray, [value, value, utils_1._]);
                    continue;
                }
                if (utils_1.isArray(value)) {
                    var arr = value;
                    if (arr.length !== 2) {
                        errors_1.argumentError(literals_1.translate);
                    }
                    utils_1.transfer(translateArray, [arr[literals_1.x], arr[literals_1.y], utils_1._]);
                    continue;
                }
                errors_1.argumentError(literals_1.translate);
            case literals_1.translateX:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translateArray[literals_1.x] = value;
                    continue;
                }
                errors_1.argumentError(literals_1.translateX);
            case literals_1.translateY:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translateArray[literals_1.y] = value;
                    continue;
                }
                errors_1.argumentError(literals_1.translateY);
            case literals_1.translateZ:
                if (utils_1.isString(value) || utils_1.isNumber(value)) {
                    translateArray[literals_1.z] = value;
                    continue;
                }
                errors_1.argumentError(literals_1.translateZ);
            case literals_1.transform:
                translateArray.push(value);
                break;
            default:
                var prop2 = prop.replace(literals_1.hyphenToPascal, utils_1.replaceCamelCased);
                output[prop2] = value;
                break;
        }
    }
    var transformArray = [];
    if (scaleArray.some(utils_1.isDefined)) {
        transformArray[literals_1.scale3d] = utils_1.transformFunction(literals_1.scale3d, scaleArray);
    }
    if (translateArray.some(utils_1.isDefined)) {
        translateArray[literals_1.translate3d] = utils_1.transformFunction(literals_1.translate3d, utils_1.fill(translateArray, 0));
    }
    if (skewArray.some(utils_1.isDefined)) {
        transformArray[literals_1.skew] = utils_1.transformFunction(literals_1.skew, utils_1.fill(skewArray, 0));
    }
    if (rotateArray.some(utils_1.isDefined)) {
        translateArray[literals_1.translate3d] = utils_1.transformFunction(literals_1.rotate, utils_1.fill(rotateArray, 0));
    }
    if (transformArray.length) {
        output[literals_1.transform] = transformArray.join(' ');
    }
    return output;
}
exports.keyframeTransformer = keyframeTransformer;
