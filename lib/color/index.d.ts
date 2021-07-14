/**
 * Smartface Color Util module
 * @module color
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 * @see {@link https://www.npmjs.com/package/tinycolor2|tinycolor2}
 * @example
 * import Color = require('@smartface/native/ui/color');
 * import colorUtil from '@smartface/extension-utils/lib/color';
 * colorUtil.rgb(Color.RED); //#ff0000
 * colorUtil.rgb(Color.BLUE).tinycolor.darken().toHexString(); //'#0000cc'
 */
const Color = require('@smartface/native/ui/color');
const tinycolor_ = require("tinycolor2");

/**
 * Returns 6 digit hexadecimal string from Color object. Does not start with # character
 * @public
 * @static
 * @method
 * @params {UI.Color} color - Smartface Color Object, without gradient
 * @returns {string} Hexadecimal RGB representation of the color
 */
export function rgb(color: Color): string;

/**
 * Returns 8 digit hexadecimal string from Color object. Does not start with # character
 * @public
 * @static
 * @method
 * @params {UI.Color} color - Smartface Color Object, without gradient
 * @returns {string} Hexadecimal RGBA representation of the color
 */
export function rgba(color: Color): string;

/**
 * Returns 8 digit hexadecimal string from Color object. Does not start with # character
 * @public
 * @static
 * @method
 * @params {UI.Color} color - Smartface Color Object, without gradient
 * @returns {string} Hexadecimal ARGB representation of the color
 */
export function argb(color: Color): string;


/**
 * Creates a tinycolor object from UI.Color
 * @method
 * @public
 * @static
 * @params {UI.Color} color - Smartface Color Object, without gradient
 * @returns {tinycolor}
 * @see {@link https://github.com/bgrins/TinyColor|TinyColor}
 */
export function tinycolor(color: Color): tinycolor;