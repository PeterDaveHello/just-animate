declare var require;
var easings = require('./animations/easings.json');

declare const angular;
import {AnimationManager} from './app/AnimationManager';
import * as animations from './animations/_all';

angular.module('just.animate', [])
    .service('just', function(): AnimationManager {
        const animationManager = new AnimationManager();
        animationManager.configure(undefined, easings);
        
        for (let animationName in animations) {
            if (animations.hasOwnProperty(animationName)) {
                const animationOptions = animations[animationName];
                animationManager.register(animationName, animationOptions)
            }
        }
        return animationManager;
    });
