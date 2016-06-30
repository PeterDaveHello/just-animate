import { isDefined, isNumber, isString, isArray, map, extend,
    fill, toArray, transfer, replaceCamelCased, transformFunction, _ } from './utils';
import { argumentError } from './errors';

import { hyphenToPascal, offset,
    rotate, rotate3d, rotateX, rotateY, rotateZ,
    scale, scale3d, scaleX, scaleY, scaleZ,
    skew, skewX, skewY, transform,
    translate, translate3d, translateX, translateY, translateZ, x, y, z
} from './literals';



/**
 * Handles converting animations options to a usable format
 */
export function animationTransformer(a: ja.IAnimationOptions): ja.IAnimationOptions {
    const keyframes = map(a.keyframes, keyframeTransformer);
    return {
        keyframes: normalizeKeyframes(keyframes),
        name: a.name,
        timings: extend({}, a.timings)
    };
}

/**
 * If a property is missing at the start or end keyframe, the first or last instance of it is moved to the end.
 */
export function normalizeKeyframes(keyframes: ja.IKeyframe[]): ja.IKeyframe[] {
    const len = keyframes.length;

    // don't attempt to fill animation if less than 2 keyframes
    if (len < 2) {
        return keyframes;
    }

    const first = keyframes[0];
    // ensure first offset    
    if (first.offset !== 0) {
        first.offset = 0;
    }

    const last = keyframes[len - 1];
    // ensure last offset
    if (last.offset !== 1) {
        last.offset = 1;
    }

    // explicitly set implicit offsets
    const lasti = len - 1;
    for (let i = 1; i < lasti; i++) {
        const target = keyframes[i];

        // skip entries that have an offset        
        if (isNumber(target.offset)) {
            continue;
        }

        // search for the next offset with a value        
        for (let j = i + 1; j < len; j++) {
            // pass if offset is not set
            if (!isNumber(keyframes[j].offset)) {
                continue;
            }

            // calculate timing/position info
            const startTime = keyframes[i - 1].offset;
            const endTime = keyframes[j].offset;
            const timeDelta = endTime - startTime;
            const deltaLength = j - i + 1;

            // set the values of all keyframes between i and j (exclusive)
            for (let k = 1; k < deltaLength; k++) {
                // set to percentage of change over time delta + starting time
                keyframes[k - 1 + i].offset = ((k / j) * timeDelta) + startTime;
            }

            // move i past this keyframe since all frames between should be processed
            i = j;
            break;
        }
    }

    // fill initial keyframe with missing props
    for (let i = 1; i < len; i++) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop === offset || isDefined(first[prop])) {
                continue;
            }
            first[prop] = keyframe[prop];
        }
    }

    // fill end keyframe with missing props
    for (let i = len - 2; i > -1; i--) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop === offset || isDefined(last[prop])) {
                continue;
            }
            last[prop] = keyframe[prop];
        }
    }

    return keyframes;
}

/**
 * Handles transforming short hand key properties into their native form
 */
export function keyframeTransformer(keyframe: ja.IKeyframe): ja.IKeyframe {
    // transform properties
    const scaleArray: number[] = [_, _, _];
    const skewArray: (string | number)[] = [_, _];
    const rotateArray: (string | number)[] = [_, _, _, _];
    const translateArray: (string | number)[] = [_, _, _];

    const output: ja.IMap<any> = {};

    for (let prop in keyframe) {
        const value = keyframe[prop];

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
                    const arr = value as number[];
                    if (arr.length !== 3) {
                        argumentError(scale3d);
                    }
                    transfer(scaleArray, arr);
                    continue;
                }
                argumentError(scale3d);
            case scale:
                if (isArray(value)) {
                    const arr = value as number[];
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
                    const arr = value as number[];
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
                    const arr = value as number[];
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
                    const arr = value as (number | string)[];
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
                    const arr = value as (number | string)[];
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
                const prop2 = prop.replace(hyphenToPascal, replaceCamelCased);
                output[prop2] = value;
                continue;
        }
    }

    const transformArray: string[] = [];
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
