/**
 * Smartface Speech to Text util module
 * @module speechToText
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

import TextBox = require('@smartface/native/ui/textbox');

/**
 * Starts listening user and write it to textBox that given as paramater.
 * When SpeecRecognizer stops onStop will be triggered. If there is an exception
 * occurs, onStop will be triggered with "error" parameter.
 * For android, methods checks permissions automatically.
 * @function speechToText:startType
 * @param {UI.TextBox|UI.TextArea|UI.Label} textBox object set the text to
 * @param {Number} [timeout = 3000] stops speech recognition after given time
 * @param {speechToText:startTypeCallback} onStop
 * @see {@link https://developer.smartface.io/docs/speechrecognizer|Speech Recognizer guide}
 * @public
 * @static
 * @example
 * const speechToText = require("@smartface/extension-utils/lib/speechtotext");
 * speechToText.startType(myTextBoxInput,4000);
 */
export function startType(textBox: TextBox, timeout?: number, onStop?: () => any): void;

/**
 * State for Speech2TextUtil. If is timeout or error occurred, isRunning will became false.
 * 
 * @property {boolean} speechToText:isRunning
 * @static
 * @public
 * @readonly
 */
export const isRunning: boolean;

/**
 * Stops a running Speech Recognizer
 * * @function speechToText:stop
 * @public
 * @static
 */
export function stop(): void;
