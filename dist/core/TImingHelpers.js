"use strict";
var utils_1 = require('./utils');
function transformFunction(name, params) {
    return name + "(" + utils_1.toArray(arguments, 1).join(',') + ")";
}
exports.transformFunction = transformFunction;
