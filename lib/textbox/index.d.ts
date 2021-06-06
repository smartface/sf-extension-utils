/**
 * Smartface TextBox util module
 * @module textBox
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

import TextBox = require('@smartface/native/ui/textbox');

/**
 * Sets the max length for the textbox. This is replacing the onTextChanged
 * event for the textbox. In order to use the onTextChanged, use the given
 * option to set the onTextChanged event. It is possible to target TextArea too.
 * @method
 * @public
 * @static
 * @params {UI.TextBox|UI.TextArea} textBox - target textBox to limit the max length
 * @params {number} maxLength - Maximum text length of the TextBox
 * @params {function} [onTextChange] - User defined onTextChanged event for the TextBox
 * @example
 * const textBoxUtil = require("sf-extension-utils/lib/textbox");
 * //inside page.onLoad
 * const page = this;
 * const tb = page.textBox1;
 * const ta = page.textArea1;
 * 
 * textBoxUtil.setMaxtLenth(tb, 10, function(e) {
 *     console.log("user textChanged for TextBox");
 * });
 * 
 * textBoxUtil.setMaxtLenth(ta, 10, function(e) {
 *     console.log("user textChanged for TextArea");
 * });
 */
export function setMaxtLenth(textBox: Textbox, maxLength: number, onTextChange: () => any): void;