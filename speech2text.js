const Timer            = require("sf-core/timer");
const System           = require('sf-core/device/system');
const Application      = require("sf-core/application");
const SpeechRecognizer = require("sf-core/speechrecognizer");

/**
 * @class Speech2TextUtil
 * @since 1.1.3
 * 
 * An util class for Speech2Text operations.
 */
function Speech2TextUtil() {};

Object.defineProperty(Speech2TextUtil, "startType", {
    
    /**
     * Starts listening user and write it to textBox that given as paramater.
     * For android, methods checks permissions automatically.
     * 
     * @param {UI.TextBox} textBox
     * @param {Number} [delay = 3000]
     * @method startType
     * @readonly
     * @android
     * @ios
     * @static
     * @since 1.0.0
     */ 
    value: function(textBox, delay) {
        if (SpeechRecognizer.isRunning() || textBox == null || textBox.text == null) {
            return;
        }
        
        if(System.OS === "iOS") {
            run(textBox, delay);
        } else {
            const RECORD_AUDIO_CODE = 1002;
            Application.android.onRequestPermissionsResult = function(e){
                if(e.requestCode === RECORD_AUDIO_CODE && e.result) {
                    run(textBox, delay);
                }
            }
            Application.android.requestPermissions(RECORD_AUDIO_CODE, Application.android.Permissions.RECORD_AUDIO);
        }
    },
    enumarable: true
});

function run(textBox, delay) {
    var tickDelay = (delay)? delay : 3000;
    var lastTick = Date.now();
    var oldText = textBox.text;
    
    SpeechRecognizer.start({
        onResult:function(result) {
            textBox.text = oldText + result;
            lastTick = Date.now();
        },
        onFinish  : function(result) {},
        onError : function(error) {}
    });
    
    var t = Timer.setInterval({
        delay: 250,
        task: function() {
            if (Date.now() - lastTick > tickDelay) {
                Timer.clearTimer(t);
                
                if (SpeechRecognizer.isRunning()) {
                    SpeechRecognizer.stop()
                }
            }
        }
    });
}

module.exports = Speech2TextUtil;