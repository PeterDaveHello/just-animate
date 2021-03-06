"use strict";
exports.rotateOutUpLeft = {
    keyframes: [
        {
            'transform-origin': 'left bottom',
            transform: 'none',
            opacity: 1
        },
        {
            'transform-origin': 'left bottom',
            transform: 'rotate3d(0, 0, 1, -45deg)',
            opacity: 0
        }
    ],
    timings: {
        duration: 1000
    },
    name: 'rotateOutUpLeft'
};
