const Timer            = require("sf-core/timer");
const System           = require('sf-core/device/system');
const Application      = require("sf-core/application");
const SpeechRecognizer = require("sf-core/speechrecognizer");
const PermissionUtil   = require('sf-extension-utils/permission');

/**
 * @class Speech2TextUtil
 * @since 1.1.3
 * 
 * An util class for Speech2Text operations.
 */
function Speech2TextUtil() {};

var _isRunning = false;
/**
 * Starts listening user and write it to textBox that given as paramater.
 * When SpeecRecognizer stops onStop will be triggered. If there is an exception
 * occurs, onStop will be triggered with "error" parameter.
 * For android, methods checks permissions automatically.
 * 
 * @param {UI.TextBox} textBox
 * @param {Number} [delay = 3000]
 * @param {Function} onStop
 * @param {Object} onStop.error
 * @method startType
 * @readonly
 * @android
 * @ios
 * @static
 * @since 1.0.0
 */ 
Object.defineProperty(Speech2TextUtil, "startType", {
    value: function(textBox, delay, onStop) {
        if (SpeechRecognizer.isRunning() || textBox == null || textBox.text == null) {
            return;
        }
        PermissionUtil.applyPermission(Application.android.Permissions.RECORD_AUDIO, function(isGranted){
            if(isGranted){
                run(textBox, delay, onStop);
            }
        });
    },
    enumarable: true
});

/**
 * State for Speech2TextUtil. If is timeout or error occurred, isRunning will became false.
 * 
 * @property isRunning
 * @android
 * @ios
 * @static
 * @since 1.1.9
 */
Object.defineProperty(Speech2TextUtil, "isRunning", {
    get: function() {
        return _isRunning;
    },
    set: function(value){
        _isRunning = value;
    },
    enumarable: true
});

function run(textBox, delay, onStop) {
    var tickDelay = (delay)? delay : 3000;
    var lastTick = Date.now();
    var oldText = textBox.text;
    Speech2TextUtil.isRunning = true;
    
    SpeechRecognizer.start({
        onResult:function(result) {
            textBox.text = oldText + result;
            lastTick = Date.now();
        },
        onFinish  : function(result) {},
        onError : function(error) {
            Speech2TextUtil.isRunning = false;
            onStop && onStop(error);
        }
    });
    
    var t = Timer.setInterval({
        delay: 250,
        task: function() {
            if (Date.now() - lastTick > tickDelay) {
                Speech2TextUtil.isRunning = false;
                Timer.clearTimer(t);
                onStop && onStop();
                if (SpeechRecognizer.isRunning()) {
                    SpeechRecognizer.stop();
                }
            }
        }
    });
}

module.exports = Speech2TextUtil;