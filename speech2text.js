const Timer            = require("sf-core/timer");
const System           = require('sf-core/device/system');
const Application      = require("sf-core/application");
const SpeechRecognizer = require("sf-core/speechrecognizer");

function Speech2Text() {};

Speech2Text.prototype.startType = function(textBox, delay) {
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
};

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

module.exports = Speech2Text;