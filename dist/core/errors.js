"use strict";
function argumentError(name) {
    throw new Error("invalid parameter: " + name);
}
exports.argumentError = argumentError;
