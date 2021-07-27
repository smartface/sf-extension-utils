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

const Screen = require('@smartface/native/device/screen');
const System = require('@smartface/native/device/system');
const shortEdge = Math.min(Screen.width, Screen.height);
const longEdge = Math.max(Screen.width, Screen.height);
const constants = {
    PORTRAIT: "portrait",
    LANDSCAPE: "landscape"
};

/**
 * gets current orientation of the device. Better to be called when the page is shown or later
 * @function orientation:getOrientation
 * @public
 * @static
 * @returns {string}
 * @example
 * import orientationLib from "@smartface/extension-utils/lib/orientation";
 * page.onShow = function() {
 *     var orientation = orientationLib.getOrientation();
 *     console.log(orientation); // portrait
 *     arrangeLayout(this, orientation);
 * };
 */
function getOrientation() {
    var w = Screen.width;
    var h = Screen.height;
    if (h > w)
        return constants.PORTRAIT;
    else
        return constants.LANDSCAPE;
}

/**
 * gives rotated value for the given orientation. Does not roates the screen!
 * @function orientation:rotate
 * @param {string} orientation value
 * @static
 * @public
 * @returns {string} rotated value for the given orientation
 * @example
 * import orientationLib from "@smartface/extension-utils/lib/orientation";
 * const orientation = orientationLib.rotate(orientationLib.PORTRAIT);
 * console.log(String(orientation === orientationLib.LANDSCAPE); //true
 */
function rotate(orientation) {
    if (orientation === constants.LANDSCAPE)
        return constants.PORTRAIT;
    else if (orientation === constants.PORTRAIT)
        return constants.LANDSCAPE;
}

/**
 * gives new orientation value during {UI.Page.onOrientationChange} event.
 * Should be called only within that event. Handles iOS & Android differnces.
 * @function orientation:getOrientationOnchage
 * @static
 * @public
 * @returns {string} target orientation value when the rotation completes
 * @example
 * import orientationLib from "@smartface/extension-utils/lib/orientation";
 * page.onOrientationChange = function() {
 *     const orientation = orientationLib.getOrientationOnchage();
 *     console.log(orientation); // landscape
 *     arrangeLayout(this, orientation);
 * };
 */
function getOrientationOnchage() {
    var orientation = getOrientation();
    if (System.OS === "Android")
        return orientation;
    else
        return rotate(orientation);
}

Object.assign(exports, constants, {
    getOrientation,
    rotate,
    getOrientationOnchage,
    shortEdge,
    longEdge
});
