/**
 * Smartface Speech to Text util module
 * @module speechToText
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2017
 */

const Timer = require("sf-core/timer");
const Application = require("sf-core/application");
const SpeechRecognizer = require("sf-core/speechrecognizer");
const permission = require('./permission');
const expect = require('chai').expect;

var isRunning = false;

exports.startType = startType;
exports.stop = stop;

/**
 * @callback speechToText:startTypeCallback
 * @param {SpeechRecognizer.Error} error
 */

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
 * const speechToText = require("sf-extension-utils").speechToText;
 * speechToText.startType(myTextBoxInput,4000);
 */
function startType(textBox, timeout, onStop) {
    if(typeof timeout === "function" && typeof onStop === "undefined") {
        onStop = timeout;
        timeout = null;
    }
    
    expect(textBox).to.be.an("object");
    expect(textBox).to.have.property('text').that.is.a('string');
    timeout && expect(timeout).to.be.a("number");
    onStop && expect(onStop).to.be.a("function");

    if (SpeechRecognizer.isRunning() || textBox == null || textBox.text == null) {
        return;
    }
    permission.getPermission(Application.android.Permissions.RECORD_AUDIO, function(err) {
        if (!err) {
            run(textBox, timeout, onStop);
        }
    });
}

/**
 * State for Speech2TextUtil. If is timeout or error occurred, isRunning will became false.
 * 
 * @property {boolean} speechToText:isRunning
 * @static
 * @public
 * @readonly
 */
exports.isRunning = undefined;
Object.defineProperty(exports, "isRunning", {
    get: function() {
        return isRunning;
    },
    enumarable: true
});

function run(textBox, timeout, onStop) {
    if (typeof timeout === "function" && !onStop) {
        onStop = timeout;
        timeout = undefined;
    }
    var tickDelay = timeout || 3000;
    var lastTick = Date.now();
    var oldText = textBox.text;
    isRunning = true;

    SpeechRecognizer.start({
        onResult: function(result) {
            textBox.text = oldText + result;
            lastTick = Date.now();
        },
        onFinish: function(result) {},
        onError: function(error) {
            isRunning = false;
            onStop && onStop(error);
        }
    });

    var t = Timer.setInterval({
        delay: 250,
        task: function() {
            if (Date.now() - lastTick > tickDelay) {
                isRunning = false;
                Timer.clearTimer(t);
                onStop && onStop();
                if (SpeechRecognizer.isRunning()) {
                    SpeechRecognizer.stop();
                }
            }
        }
    });
}

/**
 * Stops a running Speech Recognizer
 * * @function speechToText:stop
 * @public
 * @static
 */
function stop() {
    SpeechRecognizer.isRunning() && SpeechRecognizer.stop();
    isRunning = false;
}
