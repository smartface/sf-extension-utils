/* globals __SF_CALayer, __SF_CABasicAnimation, __SF_CATransaction, __SF_SMFCAAnimationDelegate */

/**
 * Smartface touch effects module
 * @module touch
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

import Color = require('@smartface/native/ui/color');
import View = require('@smartface/native/ui/view');

interface IDefaults {
    /**
     * On iOS, if fade is not being used, target is darkened. By default
     * @default 22.74
     */
    darkenAmount?: number;
    /**
     * On android, elevation change animation duration in ms.
     * @default 100
     */
    androidAnimationDuration?: number;
    /**
     * Android animation change effect rendering FPS
     * @default 60
     */
    fps?: number;
    /**
     *  Android increases the elevation of the target by the value set, after touch is cancelled, it is restored
     * @default 14
     */
    elevationChange?: number;
    /**
     * Android adds delay to trigger the touch. It is useful while viewing the ripple effect take place
     * @default 0
     */
    androidTouchDelay?: number;
    /**
     * iOS fade effect duration in miliseconds
     * @default 200
     */
    fadeDuration?: number;
    /**
     * iOS fade effect max opacity. Value between 0 and 1
     * @default 0.3
     */
    fadeMaxOpacity?: number;
    /**
     * Android ripple effect color
     * @default Color.create("#d8d8d8")
     */
    rippleColor?: Color;
    /**
     * iOS fade effect color
     * @default Color.create("#d8d8d8")
     */
    fadeColor?: Color;
}

interface IPressEventOptions {
    /**
     * called when touch starts, to add UI effect to give pressed effects. If not provided, default effect will be used. It should be used with endTouchEffect
     */
    startTouchEffect?: () => any;
    /**
     * called when press effect ends; it is used to revert the effects in startTouchEffect. It should be used together with startTouchEffect. If not provided default effect reversing will be applied
     */
    endTouchEffect?: () => any;
    /**
     * If this option is set to true, touch events won't be passed through views
     * @default false
     */
    consumeTouch?: boolean;
    /**
     * Enables the ripple effect on given target. This option specfic to Android
     * @default false
     */
    disableRippleEffect?: boolean;
    /**
     * Ripple effect requires duration before performing given event. This option specfic to Android
     * @default 0
     */
    touchDelay?: number;
    /**
     * if this options is set to true, ripple effect added on background of the given target. If target contains child components, draw ripple effect below them. This option specfic to Android.
     * @default false
     */
    rippleUseBackground?: boolean
    /**
     * Sets the color to ripple effect. This option specfic to Android
     * @default Color.create("#d8d8d8")
     */
    rippleColor?: Color;
    /**
     * Sets the color to fade effect. This option specfic to iOS
     * @default Color.create("#d8d8d8")
     */
    fadeColor?: Color;
    /**
     * Sets duration to fade effect. This option specfic to iOS. Default 0.2 seconds
     * @default 200
     */
    fadeDuration?: number;
    /**
     * Sets maximum opacity to fade effect. This option specfic to iOS. Default 0.3
     * @default 0.3
     */
    fadeMaxOpacity?: number;
}

/**
 * Sets the default values for touch effects. This may not affect after press event is added
 * @public
 * @static
 * @method
 * @params {touch~Defaults} options - Changes the default values for the given key
 */
export function setDefaults(options: IDefaults): void;



/**
 * Gets the default values for touch effects
 * @public
 * @static
 * @method
 * @returns {touch~Defaults} default values for touch effects
 * @example
 * import touch from 'sf-extension-utils/lib/touch'
 * console.log("Animation FPS = " + touch.getDefaults().fps);
 */
export function getDefaults(): IDefaults;

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
 * import touch from 'sf-extension-utils/lib/touch'
 * //inside page.onLoad
 * touch.addPressEvent(this.flBtn, () => {
 *     alert("Pressed");
 * });
 */
export function addPressEvent(target: View, event: () => any, options?: IPressEventOptions): void;

/**
 * Default press effect function. Takes `this` as target. Darkens color for iOS, adds elevation for Android
 * @public
 * @static
 * @example
 * import touch = require("sf-extension-utils/lib/touch");
 * import System = require('@smartface/native/device/system');
 * //inside page.onLoad
 * touch.addPressEvent(this.flBtn, () => {
 *     alert("Pressed");
 * }, {
     startTouchEffect: System.OS === "iOS"? function addCustomIOSEffect(){ }: touch.defaultAddPressEffect,
     endTouchEffect: System.OS === "iOS"? function removeCustomIOSEffect(){ }: touch.defaultClearPressEffect,
 });
 */
export function defaultAddPressEffect(): void;

/**
 * Default remove press effect function. Takes `this` as target. Restores the color for iOS, resets elevation for Android
 * @public
 * @static
 * @example
 * import touch from 'sf-extension-utils/lib/touch';
 * import System = require('@smartface/native/device/system');
 * //inside page.onLoad
 * touch.addPressEvent(this.flBtn, () => {
 *     alert("Pressed");
 * }, {
     startTouchEffect: System.OS === "iOS"? function addCustomIOSEffect(){ }: touch.defaultAddPressEffect,
     endTouchEffect: System.OS === "iOS"? function removeCustomIOSEffect(){ }: touch.defaultClearPressEffect,
 });
 */
export function defaultClearPressEffect(): void;