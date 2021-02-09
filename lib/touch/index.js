/* globals __SF_CALayer, __SF_CABasicAnimation, __SF_CATransaction, __SF_SMFCAAnimationDelegate */

/**
 * Smartface touch effects module
 * @module touch
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

require("../base"); //make sure setInterval is correct
const System = require('sf-core/device/system');
const color = require("../color");
const Color = require('sf-core/ui/color');

const DARKEN_AMOUNT = 22.74;
const ANDROID_ANIMATION_DURATION = 100;
const FPS = 60;
const ELEVATION_CHANGE = 14;
const ANDROID_TOUCH_DELAY = 0;
const FADE_DURATION = 200;
const FADE_MAX_OPACITY = 0.3;
const RIPPLE_COLOR = Color.create("#d8d8d8");
const FADE_COLOR = Color.create("#d8d8d8");

var darkenAmount = DARKEN_AMOUNT;
var androidAnimationDuration = ANDROID_ANIMATION_DURATION;
var fps = FPS;
var elevationChange = 14;
var androidTouchDelay = ANDROID_TOUCH_DELAY;
var fadeDuration = FADE_DURATION;
var fadeMaxOpacity = FADE_MAX_OPACITY;
var rippleColor = RIPPLE_COLOR;
var fadeColor = FADE_COLOR;


/**
 * Defaults for touch effect animations
 * @typedef {Object} Defaults
 * @property {number} darkenAmount=22.74 - On iOS, if fade is not being used, target is darkened. By default
 * @property {number} androidAnimationDuration=100 - On android, elevation change animation duration in ms.
 * @property {number} fps=60 - Android animation change effect rendering FPS
 * @property {number} elevationChange=14 - Android increases the elevation of the target by the value set, after touch is cancelled, it is restored
 * @property {number} androidTouchDelay=0 - Android adds delay to trigger the touch. It is useful while viewing the ripple effect take place
 * @property {number} fadeDuration=200 - iOS fade effect duration in miliseconds
 * @property {number} fadeMaxOpacity=0.3 - iOS fade effect max opacity. Value between 0 and 1
 * @property {UI.Color} rippleColor=Color.create("#d8d8d8") - Android ripple effect color
 * @property {UI.Color} fadeColor=Color.create("#d8d8d8") - iOS fade effect color
 */


/**
 * Sets the default values for touch effects. This may not affect after press event is added
 * @public
 * @static
 * @method
 * @params {touch~Defaults} options - Changes the default values for the given key
 */
const setDefaults = (options) => {
    if (options.hasOwnProperty("darkenAmount"))
        darkenAmount = options.darkenAmount;
    if (options.hasOwnProperty("androidAnimationDuration"))
        androidAnimationDuration = options.androidAnimationDuration;
    if (options.hasOwnProperty("fps"))
        fps = options.fps;
    if (options.hasOwnProperty("elevationChange"))
        elevationChange = options.elevationChange;
    if (options.hasOwnProperty("androidTouchDelay"))
        androidTouchDelay = options.androidTouchDelay;
    if (options.hasOwnProperty("fadeDuration"))
        fadeDuration = options.fadeDuration;
    if (options.hasOwnProperty("fadeMaxOpacity"))
        fadeMaxOpacity = options.fadeMaxOpacity;
    if (options.hasOwnProperty("rippleColor"))
        rippleColor = options.rippleColor;
    if (options.hasOwnProperty("fadeColor"))
        fadeColor = options.fadeColor;
};



/**
 * Gets the default values for touch effects
 * @public
 * @static
 * @method
 * @returns {touch~Defaults} default values for touch effects
 * @example
 * import touch from "sf-extension-utils/lib/touch";
 * console.log("Animation FPS = " + touch.getDefaults().fps);
 */
const getDefaults = () => ({
    darkenAmount,
    androidAnimationDuration,
    fps,
    elevationChange,
    androidTouchDelay,
    fadeDuration,
    fadeMaxOpacity,
    rippleColor,
    fadeColor
});

Object.assign(exports, {
    addPressEvent,
    defaultAddPressEffect,
    defaultClearPressEffect,
    setDefaults,
    getDefaults
});


/**
 * Adds press event to target object. It uses touch events to perform the action.
 * Useful with target FlexLayout components and proper handling in scrolling parents
 * This replaces existing touch events
 * @public
 * @static
 * @params {UI.View} target - target control to add press event
 * @params {function} event - event to be fired when press occurs
 * @params {object} [options] - Styling options
 * @params {function} [options.startTouchEffect=defaultAddPressEffect] - Function called when touch starts, to add UI effect to give pressed effects. If not provided, default effect will be used. It should be used with endTouchEffect
 * @params {function} [options.endTouchEffect=defaultClearPressEffect] - Function called when press effect ends; it is used to revert the effects in startTouchEffect. It should be used together with startTouchEffect. If not provided default effect reversing will be applied
 * @params {boolean} [options.consumeTouch] - If this option is set to true, touch events won't be passed through views
 * @params {boolean} [options.disableRippleEffect=false] - Enables the ripple effect on given target. This option specfic to Android
 * @params {number} [options.touchDelay=0] - Ripple effect requires duration before performing given event. This option specfic to Android
 * @params {boolean} [options.rippleUseBackground=false] - if this options is set to true, ripple effect added on background of the given target. If target contains child components, draw ripple effect below them. This option specfic to Android.
 * @params {UI.Color} [options.rippleColor=Color.create("#d8d8d8")] - Sets the color to ripple effect. This option specfic to Android
 * @params {UI.Color} [options.fadeColor=Color.create("#d8d8d8")] - Sets the color to fade effect. This option specfic to iOS
 * @params {number} [options.fadeDuration=200] - Sets duration to fade effect. This option specfic to iOS. Default 0.2
 * @params {number} [options.fadeMaxOpacity=0.3] - Sets maximum opacity to fade effect. This option specfic to iOS. Default 0.3
 * @example
 * import touch from "sf-extension-utils/lib/touch";
 * //inside page.onLoad
 * const page = this;
 * touch.addPressEvent(page.flBtn, () => {
 *     alert("Pressed");
 * });
 */
function addPressEvent(target, event, options) {

    options = options || {};
    options.startTouchEffect = options.startTouchEffect || defaultAddPressEffect.bind(target);
    options.endTouchEffect = options.endTouchEffect || defaultClearPressEffect.bind(target);
    options.consumeTouch = options.consumeTouch || false;
    options.touchDelay = typeof options.touchDelay === "undefined" ? androidTouchDelay : options.touchDelay;
    options.rippleUseBackground = !!options.rippleUseBackground;
    options.rippleColor = options.rippleColor || rippleColor;
    options.disableRippleEffect = options.disableRippleEffect || false;
    !options.disableRippleEffect && applyRippleEffect.call(target, !options.rippleUseBackground, options.rippleColor);
    target.__fadeDuration__ = (typeof options.fadeDuration === "undefined" ? fadeDuration : options.fadeDuration) / 1000; //need to change from ms to seconds
    target.__fadeMaxOpacity = typeof options.fadeMaxOpacity === "undefined" ? fadeMaxOpacity : options.fadeMaxOpacity;
    target.__fadeEffectColor__ = options.fadeColor || fadeColor;

    var touchStarted = false;

    if (System.OS === "iOS") {
        target.nativeObject.setValueForKey(true, "exclusiveTouch");
    }

    function startTouch() {
        options.startTouchEffect();
        touchStarted = true;
    }

    function endTouch(triggerPress) {
        options.endTouchEffect();
        triggerPress && touchStarted && event.call(target);

        touchStarted = false;
    }
    var handleTouch = () => options.consumeTouch;

    target.onTouch = () => {
        startTouch();
        return handleTouch();
    };

    target.onTouchCancelled = () => {
        endTouch(false);
        return handleTouch();
    };

    target.onTouchMoved = (isInside) => {
        !isInside && endTouch(false);
        return handleTouch();
    };


    let timeOut;
    target.onTouchEnded = (isInside) => {
        if (System.OS === "Android" && options.touchDelay > 0) {
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                endTouch(isInside);
            }, options.touchDelay);
        }
        else {
            endTouch(isInside);
        }
        return handleTouch();
    };

}


/**
 * Default press effect function. Takes `this` as target. Darkens color for iOS, adds elevation for Android
 * @public
 * @static
 * @example
 * import touch from "sf-extension-utils/lib/touch";
 * import System from 'sf-core/device/system';
 * //inside page.onLoad
 * const page = this;
 * touch.addPressEvent(page.flBtn, () => {
 *     alert("Pressed");
 * }, {
     startTouchEffect: System.OS === "iOS"? function addCustomIOSEffect(){ }: touch.defaultAddPressEffect,
     endTouchEffect: System.OS === "iOS"? function removeCustomIOSEffect(){ }: touch.defaultClearPressEffect,
 });
 */
function defaultAddPressEffect() {
    const target = this;
    const TICKS = 1000 / fps;
    const ELEVATION_CHANGE_PER_FRAME = elevationChange / (androidAnimationDuration / TICKS);
    if (System.OS === "Android") {
        target.__pressEffectAnimating__ = "addPress";
        if (!target.__pressEffectOriginalZIndex__ && target.__pressEffectOriginalZIndex__ !== 0)
            target.__pressEffectOriginalZIndex__ = target.android.zIndex;
        let maxZIndex = target.__pressEffectOriginalZIndex__ + elevationChange;
        if (elevationChange !== 0) {
            let animationInterval = setInterval(() => {
                if (target.__pressEffectAnimating__ !== "addPress") {
                    clearInterval(animationInterval);
                }
                let newZIndex = Math.min(target.android.zIndex + ELEVATION_CHANGE_PER_FRAME, maxZIndex);
                if (newZIndex === maxZIndex) {
                    clearInterval(animationInterval);
                    target.__pressEffectAnimating__ = null;
                }
                target.android.zIndex = newZIndex;
            }, TICKS);
        }
    }
    else if (target.backgroundColor || target.__fadeEffectColor__) {
        if (!target.__pressEffectGeneratedColor__) {
            if (target.__fadeEffectColor__) {
                target.__pressEffectGeneratedColor__ = target.__fadeEffectColor__;
            }
            else {
                let darkColorObj = color.tinycolor(target.backgroundColor).darken(darkenAmount).toRgb();
                let darkColor = Color.create(darkColorObj.a * 100, darkColorObj.r, darkColorObj.g, darkColorObj.b);
                target.__pressEffectGeneratedColor__ = darkColor;
            }

            var layer = new __SF_CALayer();
            layer.frame = target.nativeObject.bounds;
            layer.backgroundCGColor = target.__pressEffectGeneratedColor__.nativeObject;
            target.__pressEffectLayer__ = layer;
        }

        if (!target.__isPressEffetLayerActive__) {
            target.__isPressEffetLayerActive__ = true;
            target.nativeObject.layer.addSublayer(target.__pressEffectLayer__);
        }

        var animation = __SF_CABasicAnimation.animationWithKeyPath("opacity");
        var currentOpacity = 0;
        if (target.__pressEffectLayer__.getPresentationLayer()) {
            currentOpacity = target.__pressEffectLayer__.getPresentationLayer().opacity;
        }
        animation.fromValue = currentOpacity;
        animation.toValue = target.__fadeMaxOpacity;
        animation.duration = (target.__fadeMaxOpacity - currentOpacity) * target.__fadeDuration__ / target.__fadeMaxOpacity;
        __SF_CATransaction.begin();
        __SF_CATransaction.setDisableActions(true);
        target.__pressEffectLayer__.opacity = target.__fadeMaxOpacity;
        __SF_CATransaction.commit();
        target.__pressEffectLayer__.addAnimationForKey(animation, "opacity");
    }
}


/**
 * Default remove press effect function. Takes `this` as target. Restores the color for iOS, resets elevation for Android
 * @public
 * @static
 * @example
 * import touch from "sf-extension-utils/lib/touch";
 * import System from 'sf-core/device/system';
 * //inside page.onLoad
 * const page = this;
 * touch.addPressEvent(page.flBtn, () => {
 *     alert("Pressed");
 * }, {
     startTouchEffect: System.OS === "iOS"? function addCustomIOSEffect(){ }: touch.defaultAddPressEffect,
     endTouchEffect: System.OS === "iOS"? function removeCustomIOSEffect(){ }: touch.defaultClearPressEffect,
 });
 */
function defaultClearPressEffect() {
    const target = this;
    const TICKS = 1000 / fps;
    const ELEVATION_CHANGE_PER_FRAME = elevationChange / (androidAnimationDuration / TICKS);
    if (System.OS === "Android" && (target.__pressEffectOriginalZIndex__ || target.__pressEffectOriginalZIndex__ === 0)) {
        target.__pressEffectAnimating__ = "removePress";
        if (elevationChange !== 0) {
            let animationInterval = setInterval(() => {
                if (target.__pressEffectAnimating__ !== "removePress") {
                    clearInterval(animationInterval);
                }
                let newZIndex = Math.max(target.android.zIndex - ELEVATION_CHANGE_PER_FRAME, target.__pressEffectOriginalZIndex__);
                if (newZIndex === target.__pressEffectOriginalZIndex__) {
                    clearInterval(animationInterval);
                    target.__pressEffectAnimating__ = null;
                }
                target.android.zIndex = newZIndex;
            }, TICKS);
        }
    }
    else if (target.__pressEffectLayer__) {
        if (!target.__pressEffectLayer__.getPresentationLayer()) {
            target.__pressEffectLayer__.removeFromSuperlayer();
            target.__isPressEffetLayerActive__ = false;
            return;
        }
        var animation = __SF_CABasicAnimation.animationWithKeyPath("opacity");
        var currentOpacity = target.__pressEffectLayer__.getPresentationLayer().opacity;
        animation.fromValue = currentOpacity;
        animation.toValue = 0;
        animation.duration = currentOpacity * target.__fadeDuration__ / target.__fadeMaxOpacity;
        __SF_CATransaction.begin();
        __SF_CATransaction.setDisableActions(true);
        target.__pressEffectLayer__.opacity = 0;
        __SF_CATransaction.commit();
        var animationDelegate = new __SF_SMFCAAnimationDelegate();
        animationDelegate.animationDidStop = function(result) {
            if (result.flag) {
                target.__pressEffectLayer__.removeFromSuperlayer();
                target.__isPressEffetLayerActive__ = false;
            }
        };
        animation.delegate = animationDelegate;
        target.__pressEffectLayer__.addAnimationForKey(animation, "opacity");
    }
}

function applyRippleEffect(useForeground, rippleColor) {
    const target = this;
    if (target.android.rippleEnabled)
        return;
    target.android.rippleEnabled = true;
    target.android.useForeground = useForeground;
    target.android.rippleColor = rippleColor;
}
