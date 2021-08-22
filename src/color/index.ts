/**
 * Smartface Color Util module
 * @module color
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 * @see {@link https://www.npmjs.com/package/tinycolor2|tinycolor2}
 * @example
 * ```
 * import Color = require('@smartface/native/ui/color');
 * import colorUtil from '@smartface/extension-utils/lib/color';
 * colorUtil.rgb(Color.RED); //#ff0000
 * colorUtil.rgb(Color.BLUE).tinycolor.darken().toHexString(); //'#0000cc'
 * ```
 */
import Color from '@smartface/native/ui/color';
import TinyColor from "tinycolor2";

/**
 * Returns 6 digit hexadecimal string from Color object. Does not start with # character
 */
export function rgb(color: Color): string {
  //@ts-ignore
  const r = pad0(Color.red(color).toString(16));
  //@ts-ignore
  const g = pad0(Color.green(color).toString(16));
  //@ts-ignore
  const b = pad0(Color.blue(color).toString(16));
  return r + g + b;
}

/**
 * Returns 8 digit hexadecimal string from Color object. Does not start with # character
 * @public
 * @static
 * @method
 * @params {UI.Color} color - Smartface Color Object, without gradient
 * @returns {string} Hexadecimal RGBA representation of the color
 */
export function rgba(color: Color): string {
  //@ts-ignore
  const a = pad0(Color.alpha(color).toString(16));
  return rgb(color) + a;
}

/**
 * Returns 8 digit hexadecimal string from Color object. Does not start with # character
 * @public
 * @static
 * @method
 * @params {UI.Color} color - Smartface Color Object, without gradient
 * @returns {string} Hexadecimal ARGB representation of the color
 */
export function argb(color: Color): string {
  //@ts-ignore
  const a = pad0(Color.alpha(color).toString(16));
  return a + rgb(color);
}


/**
 * Creates a tinycolor object from UI.Color
 * @method
 * @public
 * @static
 * @params {UI.Color} color - Smartface Color Object, without gradient
 * @returns {tinycolor}
 * @see {@link https://github.com/bgrins/TinyColor|TinyColor}
 */
export function tinycolor(color: Color): InstanceType<typeof TinyColor> {
  const a = Number(Color.alpha(color)) / 2.55;
  const r = Number(Color.red(color));
  const g = Number(Color.green(color));
  const b = Number(Color.blue(color));
  return TinyColor({ a, r, g, b });
}

function pad0(value: string): string {
  if (value.length < 2)
      return "0" + value;
  else return value;
}
