const AlertView = require('sf-core/ui/alertview');

const AlertViewUtil = {};

/**
 *    @example
 *    // Full example
 *    AlertViewUtil.showAlert("Title", "Message", {
 *        text: "NegativeButton",
 *        callback: function(){};
 *    }, {
 *        text: "PositiveButton",
 *        callback: function(){};
 *    });
 *      
 *    // Just alert with message
 *    AlertViewUtil.showAlert("Message");
 *      
 *    // Just alert with title and message
 *    AlertViewUtil.showAlert("Title", "Message");
 */ 
Object.defineProperties(AlertViewUtil, {
    "showAlert": {
        value: function(title, message, negativeButton, positiveButton){
            var myAlertView;
            if (arguments.length === 1) {
                myAlertView = new AlertView({
                    message: title
                });
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
    
                if(negativeButton){
                    myAlertView.addButton({
                        type: AlertView.Android.ButtonType.NEGATIVE,
                        text: negativeButton.text,
                        onClick: function() {
                            negativeButton.callback && negativeButton.callback();
                        }
                        
                    });
                }
                if(positiveButton){
                    myAlertView.addButton({
                        type: AlertView.Android.ButtonType.POSITIVE,
                        text: positiveButton.text,
                        onClick: function() {
                            positiveButton.callback && positiveButton.callback();
                        }
                        
                    });
                }
            }
            myAlertView.show();
        },
        enumarable: true
    },
});

module.exports = AlertViewUtil;