"use strict";
exports.slideOutLeft = {
    keyframes: [
        {
            visibility: 'visible',
            transform: 'translate3d(0, 0, 0)'
        },
        {
            visibility: 'hidden',
            transform: 'translate3d(-100%, 0, 0)'
        }
    ],
    timings: {
        duration: 1000
    },
    name: 'slideOutLeft'
};
