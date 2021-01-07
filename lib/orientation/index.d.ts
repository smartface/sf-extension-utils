/**
 * Smartface Location module
 * @module orientation
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 * @property {string} [PORTRAIT = portrait] enum value
 * @property {string} [LANDSCAPE = landspace] enum value
 * @property {number} shortEdge gives short edge of the screen
 * @property {number} longEdge gives long edge of the screen
 */

/**
 * gets current orientation of the device. Better to be called when the page is shown or later
 * @function orientation:getOrientation
 * @public
 * @static
 * @returns {string}
 * @example
 * import orientationLib from 'sf-extension-utils/lib/orientation';
 * this.onShow = () => {
 *     const orientation = orientationLib.getOrientation();
 *     console.log(orientation); // portrait
 *     arrangeLayout(this, orientation);
 * };
 */
export function getOrientation(): string;

/**
 * gives rotated value for the given orientation. Does not roates the screen!
 * @function orientation:rotate
 * @param {string} orientation value
 * @static
 * @public
 * @returns {string} rotated value for the given orientation
 * @example
 * import orientationLib from 'sf-extension-utils/lib/orientation';
 * const orientation = orientationLib.rotate(orientationLib.PORTRAIT);
 * console.log(String(orientation === orientationLib.LANDSCAPE); //true
 */
export function rotate(orientation: string): string;

/**
 * gives new orientation value during {UI.Page.onOrientationChange} event.
 * Should be called only within that event. Handles iOS & Android differnces.
 * @function orientation:getOrientationOnchage
 * @static
 * @public
 * @returns {string} target orientation value when the rotation completes
 * @example
 * import orientationLib from 'sf-extension-utils/lib/orientation';
 * this.onOrientationChange = function() {
 *     const orientation = orientationLib.getOrientationOnchage();
 *     console.log(orientation); // landscape
 *     arrangeLayout(this, orientation);
 * };
 */
export function getOrientationOnchage(): string;

/**
 * Returns the short side of the phone.
 * E.g. for 840x680 device, it will return 680
 */
export const shortEdge: number;

/**
 * Returns the short side of the phone.
 * E.g. for 840x680 device, it will return 840
 */
export const longEdge: number;
