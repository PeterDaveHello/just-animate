"use strict";
var utils_1 = require('./utils');
/**
 * Recursively resolves the element source from dom, selector, jquery, array, and function sources
 *
 * @param {ja.ElementSource} source from which to locate elements
 * @returns {Element[]} array of elements found
 */
function resolveElements(source) {
    if (!source) {
        throw Error('missing elements');
    }
    if (utils_1.isString(source)) {
        // if query selector, search for elements 
        var nodeResults = document.querySelectorAll(source);
        return utils_1.toArray(nodeResults);
    }
    if (source instanceof Element) {
        // if a single element, wrap in array 
        return [source];
    }
    if (utils_1.isFunction(source)) {
        // if function, call it and call this function
        var provider = source;
        var result = provider();
        return resolveElements(result);
    }
    if (utils_1.isArray(source)) {
        // if array or jQuery object, flatten to an array
        var elements_1 = [];
        utils_1.each(source, function (i) {
            // recursively call this function in case of nested elements
            var innerElements = resolveElements(i);
            elements_1.push.apply(elements_1, innerElements);
        });
        return elements_1;
    }
    // otherwise return empty    
    return [];
}
exports.resolveElements = resolveElements;
