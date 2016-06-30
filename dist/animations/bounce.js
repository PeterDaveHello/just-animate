"use strict";
exports.bounce = {
    name: 'bounce',
    keyframes: [
        {
            offset: 0,
            translate3d: 0
        },
        {
            offset: 0.2,
            translate3d: 0
        },
        {
            offset: 0.4,
            translateY: '-30px'
        },
        {
            offset: 0.43,
            translateY: '-30px'
        },
        {
            offset: 0.53,
            translate3d: 0
        },
        {
            offset: 0.7,
            translateY: '-15px'
        },
        {
            offset: 0.8,
            translate3d: 0
        },
        {
            offset: 0.9,
            translateY: '-4px'
        },
        {
            offset: 1,
            translate3d: 0
        }
    ],
    timings: {
        duration: 900,
        easing: 'easeOutCubic',
        fill: 'both'
    }
};
