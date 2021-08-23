/* globals __SF_CALayer, __SF_CABasicAnimation, __SF_CATransaction, __SF_SMFCAAnimationDelegate */

/**
 * Smartface touch effects module
 * @module touch
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

import System from "@smartface/native/device/system";
import Color from "@smartface/native/ui/color";
import View from "@smartface/native/ui/view";
import { tinycolor } from "../color";

const DEFAULT_GREY = "#d8d8d8";

const DEFAULTS: Readonly<IDefaults> = Object.freeze({
	darkenAmount: 22.74,
	androidAnimationDuration: 100,
	fps: 60,
	elevationChange: 14,
	androidTouchDelay: 0,
	fadeDuration: 200,
	fadeMaxOpacity: 0.3,
	rippleColor: Color.create(DEFAULT_GREY),
	fadeColor: Color.create(DEFAULT_GREY),
});

const DEFAULT_TOUCH_EFFECT: Readonly<IPressEventOptions> = Object.freeze({
	startTouchEffect: () => {},
	endTouchEffect: () => {},
	consumeTouch: false,
	disableRippleEffect: false,
	touchDelay: 0,
	rippleUseBackground: false,
	rippleColor: DEFAULTS.rippleColor,
	fadeColor: DEFAULTS.fadeColor,
	fadeDuration: DEFAULTS.fadeDuration,
	fadeMaxOpacity: DEFAULTS.fadeMaxOpacity,
});

const CurrentDefault: IDefaults = Object.assign({}, DEFAULTS);

interface IDefaults {
	/**
	 * On iOS, if fade is not being used, target is darkened. By default
	 * @default 22.74
	 */
	darkenAmount: number;
	/**
	 * On android, elevation change animation duration in ms.
	 * @default 100
	 */
	androidAnimationDuration: number;
	/**
	 * Android animation change effect rendering FPS
	 * @default 60
	 */
	fps: number;
	/**
	 *  Android increases the elevation of the target by the value set, after touch is cancelled, it is restored
	 * @default 14
	 */
	elevationChange: number;
	/**
	 * Android adds delay to trigger the touch. It is useful while viewing the ripple effect take place
	 * @default 0
	 */
	androidTouchDelay: number;
	/**
	 * iOS fade effect duration in miliseconds
	 * @default 200
	 */
	fadeDuration: number;
	/**
	 * iOS fade effect max opacity. Value between 0 and 1
	 * @default 0.3
	 */
	fadeMaxOpacity: number;
	/**
	 * Android ripple effect color
	 * @default Color.create("#d8d8d8")
	 */
	rippleColor: Color;
	/**
	 * iOS fade effect color
	 * @default Color.create("#d8d8d8")
	 */
	fadeColor: Color;
}

interface IPressEventOptions {
	/**
	 * called when touch starts, to add UI effect to give pressed effects. If not provided, default effect will be used. It should be used with endTouchEffect
	 */
	startTouchEffect: () => void;
	/**
	 * called when press effect ends; it is used to revert the effects in startTouchEffect. It should be used together with startTouchEffect. If not provided default effect reversing will be applied
	 */
	endTouchEffect: () => void;
	/**
	 * If this option is set to true, touch events won't be passed through views
	 * @default false
	 */
	consumeTouch: boolean;
	/**
	 * Enables the ripple effect on given target. This option specfic to Android
	 * @default false
	 */
	disableRippleEffect: boolean;
	/**
	 * Ripple effect requires duration before performing given event. This option specfic to Android
	 * @default 0
	 */
	touchDelay: number;
	/**
	 * if this options is set to true, ripple effect added on background of the given target. If target contains child components, draw ripple effect below them. This option specfic to Android.
	 * @default false
	 */
	rippleUseBackground: boolean;
	/**
	 * Sets the color to ripple effect. This option specfic to Android
	 * @default Color.create("#d8d8d8")
	 */
	rippleColor: Color;
	/**
	 * Sets the color to fade effect. This option specfic to iOS
	 * @default Color.create("#d8d8d8")
	 */
	fadeColor: Color;
	/**
	 * Sets duration to fade effect. This option specfic to iOS. Default 0.2 seconds
	 * @default 200
	 */
	fadeDuration: number;
	/**
	 * Sets maximum opacity to fade effect. This option specfic to iOS. Default 0.3
	 * @default 0.3
	 */
	fadeMaxOpacity: number;
}

/**
 * Sets the default values for touch effects. This may not affect after press event is added
 * @public
 * @static
 * @method
 * @params {touch~Defaults} options - Changes the default values for the given key
 */
export function setDefaults(options: Partial<IDefaults>): void {
	Object.entries(options).forEach((entry) => {
		const [key, value] = entry;
		(CurrentDefault as any)[key] = value;
	});
}

/**
 * Gets the default values for touch effects
 * @public
 * @static
 * @method
 * @returns {touch~Defaults} default values for touch effects
 * @example
 * import touch from '@smartface/extension-utils/lib/touch'
 * console.log("Animation FPS = " + touch.getDefaults().fps);
 */
export function getDefaults(): IDefaults {
	return Object.assign({}, CurrentDefault);
}

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
 * import touch from '@smartface/extension-utils/lib/touch'
 * //inside page.onLoad
 * touch.addPressEvent(this.flBtn, () => {
 *     alert("Pressed");
 * });
 */
export function addPressEvent(
	target: View,
	event: () => any,
	options?: Partial<IPressEventOptions>
): void {
	const defaultTouchEffectCopy = Object.assign({}, DEFAULT_TOUCH_EFFECT);
	const currentOptions: IPressEventOptions = Object.assign(
		{},
		defaultTouchEffectCopy,
		options || {}
	);

	currentOptions.startTouchEffect = defaultAddPressEffect.bind(target);
	currentOptions.endTouchEffect = defaultClearPressEffect.bind(target);
	if (currentOptions.disableRippleEffect) {
		applyRippleEffect.call(
			target,
			!currentOptions.rippleUseBackground,
			currentOptions.rippleColor
		);
	}
	//@ts-ignore
	target.__fadeDuration__ = (currentOptions.fadeDuration || 0) / 1000;
	//@ts-ignore
	target.__fadeMaxOpacity = currentOptions.fadeMaxOpacity;
	//@ts-ignore
	target.__fadeEffectColor__ = currentOptions.fadeColor;
	//@ts-ignore
	target.__fadeDuration__ = currentOptions.fadeDuration;

	let touchStarted = false;

	if (System.OS === System.OSType.IOS) {
		//@ts-ignore
		target.nativeObject.setValueForKey(true, "exclusiveTouch");
	}

	function startTouch() {
		currentOptions.startTouchEffect();
		touchStarted = true;
	}

	function endTouch(triggerPress = false) {
		currentOptions.endTouchEffect();
		triggerPress && touchStarted && event.call(target);
		touchStarted = false;
	}
	var handleTouch = () => currentOptions.consumeTouch;

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

	let timeOut: any;
	target.onTouchEnded = (isInside) => {
		if (System.OS === System.OSType.ANDROID && currentOptions.touchDelay > 0) {
			clearTimeout(timeOut);
			timeOut = setTimeout(() => {
				endTouch(isInside);
			}, currentOptions.touchDelay);
		} else {
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
  * import touch = require("@smartface/extension-utils/lib/touch");
  * import System = require('@smartface/native/device/system');
  * //inside page.onLoad
  * touch.addPressEvent(this.flBtn, () => {
  *     alert("Pressed");
  * }, {
      startTouchEffect: System.OS === "iOS"? function addCustomIOSEffect(){ }: touch.defaultAddPressEffect,
      endTouchEffect: System.OS === "iOS"? function removeCustomIOSEffect(){ }: touch.defaultClearPressEffect,
  });
  */
function defaultAddPressEffect(this: View): void {
	const TICKS = 1000 / DEFAULTS.fps;
	const ELEVATION_CHANGE_PER_FRAME =
		DEFAULTS.elevationChange / (DEFAULTS.androidAnimationDuration / TICKS);
	if (System.OS === System.OSType.ANDROID) {
		//@ts-ignore
		this.__pressEffectAnimating__ = "addPress";
		if (
			//@ts-ignore
			!this.__pressEffectOriginalZIndex__ &&
			//@ts-ignore
			this.__pressEffectOriginalZIndex__ !== 0
		)
			//@ts-ignore
			this.__pressEffectOriginalZIndex__ = this.android.zIndex;
		//@ts-ignore
		let maxZIndex =
			//@ts-ignore
			this.__pressEffectOriginalZIndex__ + DEFAULTS.elevationChange;
		if (DEFAULTS.elevationChange !== 0) {
			let animationInterval = setInterval(() => {
				//@ts-ignore
				if (this.__pressEffectAnimating__ !== "addPress") {
					clearInterval(animationInterval);
				}
				let newZIndex = Math.min(
					this.android.zIndex + ELEVATION_CHANGE_PER_FRAME,
					maxZIndex
				);
				if (newZIndex === maxZIndex) {
					clearInterval(animationInterval);
					//@ts-ignore
					this.__pressEffectAnimating__ = null;
				}
				this.android.zIndex = newZIndex;
			}, TICKS);
		}
		//@ts-ignore
	} else if (this.backgroundColor || this.__fadeEffectColor__) {
		//@ts-ignore
		if (!this.__pressEffectGeneratedColor__) {
			//@ts-ignore
			if (this.__fadeEffectColor__) {
				//@ts-ignore
				this.__pressEffectGeneratedColor__ = this.__fadeEffectColor__;
			} else {
				let darkColorObj = tinycolor(this.backgroundColor)
					//@ts-ignore
					.darken(darkenAmount)
					.toRgb();
				let darkColor = Color.create(
					darkColorObj.a * 100,
					darkColorObj.r,
					darkColorObj.g,
					darkColorObj.b
				);
				//@ts-ignore
				this.__pressEffectGeneratedColor__ = darkColor;
			}

			//@ts-ignore
			var layer = new __SF_CALayer();
			//@ts-ignore
			layer.frame = this.nativeObject.bounds;
			layer.backgroundCGColor =
				//@ts-ignore
				this.__pressEffectGeneratedColor__.nativeObject;
			//@ts-ignore
			this.__pressEffectLayer__ = layer;
		}

		//@ts-ignore
		if (!this.__isPressEffetLayerActive__) {
			//@ts-ignore
			this.__isPressEffetLayerActive__ = true;
			//@ts-ignore
			this.nativeObject.layer.addSublayer(this.__pressEffectLayer__);
		}

		//@ts-ignore
		var animation = __SF_CABasicAnimation.animationWithKeyPath("opacity");
		var currentOpacity = 0;
		//@ts-ignore
		if (this.__pressEffectLayer__.getPresentationLayer()) {
			//@ts-ignore
			currentOpacity = this.__pressEffectLayer__.getPresentationLayer().opacity;
		}
		animation.fromValue = currentOpacity;
		//@ts-ignore
		animation.toValue = this.__fadeMaxOpacity;
		animation.duration =
			//@ts-ignore
			((this.__fadeMaxOpacity - currentOpacity) * this.__fadeDuration__) /
			//@ts-ignore
			this.__fadeMaxOpacity;
		//@ts-ignore
		__SF_CATransaction.begin();
		//@ts-ignore
		__SF_CATransaction.setDisableActions(true);
		//@ts-ignore
		this.__pressEffectLayer__.opacity = this.__fadeMaxOpacity;
		//@ts-ignore
		__SF_CATransaction.commit();
		//@ts-ignore
		this.__pressEffectLayer__.addAnimationForKey(animation, "opacity");
	}
}

/**
  * Default remove press effect function. Takes `this` as target. Restores the color for iOS, resets elevation for Android
  * @public
  * @static
  * @example
  * import touch from '@smartface/extension-utils/lib/touch';
  * import System = require('@smartface/native/device/system');
  * //inside page.onLoad
  * touch.addPressEvent(this.flBtn, () => {
  *     alert("Pressed");
  * }, {
      startTouchEffect: System.OS === "iOS"? function addCustomIOSEffect(){ }: touch.defaultAddPressEffect,
      endTouchEffect: System.OS === "iOS"? function removeCustomIOSEffect(){ }: touch.defaultClearPressEffect,
  });
  */
function defaultClearPressEffect(this: View): void {
	const TICKS = 1000 / DEFAULTS.fps;
	const ELEVATION_CHANGE_PER_FRAME =
		DEFAULTS.elevationChange / (DEFAULTS.androidAnimationDuration / TICKS);
	if (
		System.OS === System.OSType.ANDROID &&
		//@ts-ignore
		(this.__pressEffectOriginalZIndex__ ||
			//@ts-ignore
			this.__pressEffectOriginalZIndex__ === 0)
	) {
		//@ts-ignore
		this.__pressEffectAnimating__ = "removePress";
		if (DEFAULTS.elevationChange !== 0) {
			let animationInterval = setInterval(() => {
				//@ts-ignore
				if (this.__pressEffectAnimating__ !== "removePress") {
					clearInterval(animationInterval);
				}
				let newZIndex = Math.max(
					this.android.zIndex - ELEVATION_CHANGE_PER_FRAME,
					//@ts-ignore
					this.__pressEffectOriginalZIndex__
				);
				//@ts-ignore
				if (newZIndex === this.__pressEffectOriginalZIndex__) {
					clearInterval(animationInterval);
					//@ts-ignore
					this.__pressEffectAnimating__ = null;
				}
				this.android.zIndex = newZIndex;
			}, TICKS);
		}
		//@ts-ignore
	} else if (this.__pressEffectLayer__) {
		//@ts-ignore
		if (!this.__pressEffectLayer__.getPresentationLayer()) {
			//@ts-ignore
			this.__pressEffectLayer__.removeFromSuperlayer();
			//@ts-ignore
			this.__isPressEffetLayerActive__ = false;
			return;
		}
		//@ts-ignore
		var animation = __SF_CABasicAnimation.animationWithKeyPath("opacity");
		//@ts-ignore
		var currentOpacity = this.__pressEffectLayer__.getPresentationLayer()
			.opacity;
		animation.fromValue = currentOpacity;
		animation.toValue = 0;
		animation.duration =
			//@ts-ignore
			(currentOpacity * this.__fadeDuration__) / this.__fadeMaxOpacity;
		//@ts-ignore
		__SF_CATransaction.begin();
		//@ts-ignore
		__SF_CATransaction.setDisableActions(true);
		//@ts-ignore
		this.__pressEffectLayer__.opacity = 0;
		//@ts-ignore
		__SF_CATransaction.commit();
		//@ts-ignore
		var animationDelegate = new __SF_SMFCAAnimationDelegate();
		animationDelegate.animationDidStop = function(result: any) {
			if (result.flag) {
				this.__pressEffectLayer__.removeFromSuperlayer();
				this.__isPressEffetLayerActive__ = false;
			}
		};
		animation.delegate = animationDelegate;
		//@ts-ignore
		this.__pressEffectLayer__.addAnimationForKey(animation, "opacity");
	}
}

function applyRippleEffect(
	this: View,
	useForeground: boolean,
	rippleColor: Color
) {
	//@ts-ignore
	if (this.android.rippleEnabled) return;
	//@ts-ignore
	this.android.rippleEnabled = true;
	//@ts-ignore
	this.android.useForeground = useForeground;
	//@ts-ignore
	this.android.rippleColor = rippleColor;
}
