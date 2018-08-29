/**
 * Smartface touch effects module
 * @module touch
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

require("./base"); //make sure setInterval is correct
const System = require('sf-core/device/system');
const color = require("./color");
const Color = require('sf-core/ui/color');
const DARKEN_AMOUNT = 22.74;
const ANIMATION_DURATION = 100;
const FPS = 60;
const TICKS = 1000 / FPS;
const ELEVATION_CHANGE = 14;
const ELEVATION_CHANGE_PER_FRAME = ELEVATION_CHANGE / (ANIMATION_DURATION / TICKS);

Object.assign(exports, {
    addPressEvent,
    defaultAddPressEffect,
    defaultClearPressEffect,
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
 * @params {function} [options.startTouchEffect] - Function called when touch starts, to add UI effect to give pressed effects. If not provided, default effect will be used. It should be used with endTouchEffect
 * @params {function} [options.endTouchEffect] - Function called when press effect ends; it is used to revert the effects in startTouchEffect. It should be used together with startTouchEffect. If not provided default effect reversing will be applied
 * @params {boolean} [options.consumeTouch] - If this option is set to true, touch events won't be passed through views. If not provided, default value is undefined.
 * @example
 * const touch = require("sf-extension-utils/lib/touch");
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
    options.consumeTouch = options.consumeTouch;
    var touchStarted = false;

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

    target.onTouchEnded = (isInside) => {
        endTouch(isInside);
        return handleTouch();
    };

}


/**
 * Default press effect function. Takes `this` as target. Darkens color for iOS, adds elevation for Android
 * @public
 * @static
 * @example
 * const touch = require("sf-extension-utils/lib/touch");
 * const System = require('sf-core/device/system');
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
    if (System.OS === "Android") {
        target.__pressEffectAnimating__ = "addPress";
        if (!target.__pressEffectOriginalZIndex && target.__pressEffectOriginalZIndex !== 0)
            target.__pressEffectOriginalZIndex = target.android.zIndex;
        let maxZIndex = target.__pressEffectOriginalZIndex + ELEVATION_CHANGE;
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
    else if (target.backgroundColor) {
        if (!target.__pressEffectGeneratedColor__) {
            let darkColorObj = color.tinycolor(target.backgroundColor).darken(DARKEN_AMOUNT).toRgb();
            let darkColor = Color.create(darkColorObj.a * 100, darkColorObj.r, darkColorObj.g, darkColorObj.b);
            target.__pressEffectGeneratedColor__ = darkColor;
        }
        target.__pressEffectOriginalColor__ = target.backgroundColor;
        target.backgroundColor = target.__pressEffectGeneratedColor__;
    }
}


/**
 * Default remove press effect function. Takes `this` as target. Restores the color for iOS, resets elevation for Android
 * @public
 * @static
 * @example
 * const touch = require("sf-extension-utils/lib/touch");
 * const System = require('sf-core/device/system');
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
    if (System.OS === "Android" && (target.__pressEffectOriginalZIndex || target.__pressEffectOriginalZIndex === 0)) {
        target.__pressEffectAnimating__ = "removePress";
        let animationInterval = setInterval(() => {
            if (target.__pressEffectAnimating__ !== "removePress") {
                clearInterval(animationInterval);
            }
            let newZIndex = Math.max(target.android.zIndex - ELEVATION_CHANGE_PER_FRAME, target.__pressEffectOriginalZIndex);
            if (newZIndex === target.__pressEffectOriginalZIndex) {
                clearInterval(animationInterval);
                target.__pressEffectAnimating__ = null;
            }
            target.android.zIndex = newZIndex;
        }, TICKS);
    }
    else if (target.backgroundColor && target.__pressEffectOriginalColor__) {
        target.backgroundColor = target.__pressEffectOriginalColor__;
    }
}
