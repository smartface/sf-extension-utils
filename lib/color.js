/**
 * Smartface Color Util module
 * @module color
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */
const Color = require('sf-core/ui/color');
const tinycolor_ = require("tinycolor2");

Object.assign(exports, {
    rgb,
    argb,
    rgba,
    tinycolor
});

/**
 * Returns 6 digit hexadecimal string from Color object. Does not start with # character
 * @public
 * @static
 * @method
 * @params {UI.Color} color - Smartface Color Object, without gradient
 * @returns {string} Hexadecimal RGB representation of the color
 */
function rgb(color) {
    var r = pad0(Color.red(color).toString(16));
    var g = pad0(Color.green(color).toString(16));
    var b = pad0(Color.blue(color).toString(16));
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
function rgba(color) {
    var a = pad0(Color.alpha(color).toString(16));
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
function argb(color) {
    var a = pad0(Color.alpha(color).toString(16));
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
function tinycolor(color) {
    let a = Color.alpha(color) / 2.55;
    let r = Color.red(color);
    let g = Color.green(color);
    let b = Color.blue(color);
    return tinycolor_({ a, r, g, b });
}

function pad0(value) {
    if (value.length < 2)
        return "0" + value;
    else return value;
}
