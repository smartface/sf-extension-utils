const AlertView = require('sf-core/ui/alertview');
const System = require('sf-core/device/system');

/**
 * @class AlertUtil
 * @since 1.1.3
 * 
 * An util class for AlertView.
 */
const AlertUtil = {};

/**
 * Creates and shows alerts based on parameters.
 * One parameter shows just message,
 * Two parameter shows message with title
 * Three parameters shows message, title and negative button.
 * Four parameters shows message, title, negative and positive buttons.
 * 
 * @param {String} title
 * @param {String} message
 * @param {Object} negativeButton
 * @param {String} negativeButton.text
 * @param {Function} negativeButton.callback
 * @param {Object} positiveButton
 * @param {String} positiveButton.text
 * @param {Function} positiveButton.callback
 * @method showAlert
 * @readonly
 * @android
 * @ios
 * @static
 * @since 1.1.3
 */ 
Object.defineProperty(AlertUtil, "showAlert", {
    value: function(title, message, negativeButton, positiveButton){
        var myAlertView;
        if (arguments.length === 1) {
            myAlertView = new AlertView({
                message: title
            });
            // Wait until IOS-2302
            (System.OS === "Android") && (myAlertView.android.cancellable = false);
            myAlertView.addButton({
                type: AlertView.Android.ButtonType.POSITIVE,
                text: "OK"
            });
        }
        else{
            myAlertView = new AlertView({
                title: title,
                message: message
            });
            // Wait until IOS-2302
            (System.OS === "Android") && (myAlertView.android.cancellable = false);

            if(negativeButton){
                myAlertView.addButton({
                    type: AlertView.Android.ButtonType.NEGATIVE,
                    text: negativeButton.text || "Cancel",
                    onClick: function() {
                        negativeButton.callback && negativeButton.callback();
                    }
                    
                });
            }
            if(positiveButton){
                myAlertView.addButton({
                    type: AlertView.Android.ButtonType.POSITIVE,
                    text: positiveButton.text || "Ok",
                    onClick: function() {
                        positiveButton.callback && positiveButton.callback();
                    }
                    
                });
            }
            if(!positiveButton && !negativeButton){
                myAlertView.addButton({
                    type: AlertView.Android.ButtonType.POSITIVE,
                    text: "OK"
                });
            }
        }
        myAlertView.show();
    },
    enumarable: true
});

module.exports = AlertUtil;