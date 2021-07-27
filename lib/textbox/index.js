/**
 * Smartface TextBox util module
 * @module textBox
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */
 
const System = require('@smartface/native/device/system');

Object.assign(exports, {
    setMaxtLenth
});


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
 * import textBoxUtil from "@smartface/extension-utils/lib/textbox";
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
function setMaxtLenth(textBox, maxLength, onTextChange) {
    const state = {
        text: textBox.text,
        start: textBox.cursorPosition.start,
        end: textBox.cursorPosition.end
    };
    var maxLengthFunction = null;
    if (System.OS === "Android") {
        textBox.android.maxLength(maxLength);
    }
    else {
        maxLengthFunction = maxLenghtFilter.bind(textBox, state, maxLength);
    }
    textBox.onTextChanged = onTextChanged.bind(textBox, textBox.onTextChanged && textBox.onTextChanged.bind(textBox),
        maxLengthFunction, onTextChange && onTextChange.bind(textBox));
}


function onTextChanged(superOnTextChanged, maxLenghtFilter, userOnTextChange, e) {
    superOnTextChanged && superOnTextChanged(e);
    maxLenghtFilter && maxLenghtFilter(e);
    userOnTextChange && userOnTextChange(e);
}

function maxLenghtFilter(state, maxLength, e) {
    const textBox = this;

    if (textBox.text.length > maxLength) {
        textBox.text = state.text;
        textBox.cursorPosition = {
            start: e.location,
            end: e.location
        };
    }
    else {
        Object.assign(state, {
            text: textBox.text
        }, this.cursorPosition);
    }

}
