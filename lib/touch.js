/**
 * Smartface touch effects module
 * @module touch
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

const System = require('sf-core/device/system');
const Animator = require('sf-core/ui/animator');
const ANIMATION_DURATION = 200;
const color = require("./color");
const Color = require('sf-core/ui/color');
const DARKEN_AMOUNT = 51;

Object.assign(exports, {
    addPressEvent
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
 */
function addPressEvent(target, event, options) {

    options = options || {};
    options.startTouchEffect = options.startTouchEffect || addPressEffect.bind(target);
    options.endTouchEffect = options.endTouchEffect || clearPressEffect.bind(target);

    function startTouch() {
        options.startTouchEffect();
    }

    function endTouch(triggerPress) {
        options.endTouchEffect();
        triggerPress && event.call(target);
    }

    const handleTouch = () => !!options.doNotConsumeTouch;


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

function addPressEffect() {
    const target = this;
    if (System.OS === "Android") {
        let animationRootView = target.getParent();
        Animator.animate(animationRootView, ANIMATION_DURATION, function() {
            target.android.zIndex = target.android.zIndex + 14;
        });
    }
    else if (target.backgroundColor) {
        let darkColorCode = color.tinycolor(target.backgroundColor).darken(DARKEN_AMOUNT).toString();
        target.__pressEffectOriginalColor__ = target.backgroundColor;
        target.backgroundColor = Color.create("#" + darkColorCode);
    }
}

function clearPressEffect() {
    const target = this;
    if (System.OS === "Android") {
        let animationRootView = target.getParent();
        Animator.animate(animationRootView, ANIMATION_DURATION, function() {
            target.android.zIndex = target.android.zIndex - 14;
        });
    }
    else if (target.backgroundColor) {
        target.backgroundColor = target.__pressEffectOriginalColor__;
    }
}
