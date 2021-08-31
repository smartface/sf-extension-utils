/**
 * Smartface Location module
 * @module orientation
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2018
 */

import Screen from "@smartface/native/device/screen";
import System from "@smartface/native/device/system";

const OrientationTypes = {
  PORTRAIT: "portrait",
  LANDSCAPE: "landscape"
};
exports.OrientationTypes = OrientationTypes;
/**
 * gets current orientation of the device. Better to be called when the page is shown or later
 * @function orientation:getOrientation
 * @public
 * @static
 * @returns {string}
 * @example
 * ```
 * import orientationLib from '@smartface/extension-utils/lib/orientation';
 * this.onShow = function() {
 *     const orientation = orientationLib.getOrientation();
 *     console.log(orientation); // portrait
 *     arrangeLayout(this, orientation);
 * };
 * ```
 */
function getOrientation(): string {
  return Screen.height > Screen.width ? OrientationTypes.PORTRAIT : OrientationTypes.LANDSCAPE;
}
exports.getOrientation = getOrientation;

/**
 * gives rotated value for the given orientation. Does not roates the screen!
 * @function orientation:rotate
 * @param {string} orientation value
 * @static
 * @public
 * @returns {string} rotated value for the given orientation
 * @example
 * ```
 * import orientationLib from '@smartface/extension-utils/lib/orientation';
 * const orientation = orientationLib.rotate(orientationLib.PORTRAIT);
 * console.log(String(orientation === orientationLib.LANDSCAPE); //true
 * ```
 */
function rotate(orientation: string): string {
  return orientation === OrientationTypes.LANDSCAPE ? OrientationTypes.PORTRAIT : OrientationTypes.LANDSCAPE;
}
exports.rotate = rotate;

/**
 * gives new orientation value during {UI.Page.onOrientationChange} event.
 * Should be called only within that event. Handles iOS & Android differnces.
 * @function orientation:getOrientationOnchage
 * @static
 * @public
 * @returns {string} target orientation value when the rotation completes
 * @example
 * ```
 * import orientationLib from '@smartface/extension-utils/lib/orientation';
 * this.onOrientationChange = function() {
 *     const orientation = orientationLib.getOrientationOnchage();
 *     console.log(orientation); // landscape
 *     arrangeLayout(this, orientation);
 * };
 * ```
 */
function getOrientationOnchage(): string {
  const orientation = getOrientation();
  if (System.OS === System.OSType.ANDROID)
      return orientation;
  else
      return rotate(orientation);
}
exports.getOrientationOnchage = getOrientationOnchage;

/**
 * Returns the short side of the phone.
 * E.g. for 840x680 device, it will return 680
 */
const shortEdge: number = Math.min(Screen.width, Screen.height);
exports.shortEdge = shortEdge;
/**
 * Returns the short side of the phone.
 * E.g. for 840x680 device, it will return 840
 */
const longEdge: number = Math.max(Screen.width, Screen.height)
exports.longEdge = longEdge;
export = exports;