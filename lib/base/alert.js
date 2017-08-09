/**
 * Smartface global alert replacer
 * @module alert
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2017
 */

const AlertView = require("sf-core/ui/alertview");
const System = require('sf-core/device/system');
const langChecker = require("./langchecker")("alert");

langChecker.check("ok");
module.exports = exports = oldAlert;

/** 
 * @typedef {object} AlertButton
 * @property {UI.AlertView.Android.ButtonType} type Button type, it is set to UI.AlertView.Android.ButtonType.NEUTRAL as default
 * @property {string} text Button text. It's letter case behaves differently on the platforms
 * @property {function} onClick Callback for button click action
 */

/**
 * Creates a new AlertView instance and automatically shows it
 * @function alert
 * @param {object|string} options is the alert options or the string to display as message. If object is used, it is automatically passed as constructor to the AlertView
 * @param {string} options.message sets message of AlertView
 * @param {string} options.title sets title of AlertView
 * @param {AlertButton[]} options.buttons shows OK if omited
 * @param {string} title optinal title
 * @returns {UI.AlertView} created AlertView object
 * @see {@link https://developer.smartface.io/docs/alertview|AlertView Guide}
 * @see {@link http://ref.smartface.io/#!/api/UI.AlertView.Android.ButtonType|Button Types}
 * @example
 * alert("Hello World!");
 * @example
 * alert("message", "title");
 * @example
 * alert({
 *  message: "message",
 *  title: "title" //optional
 * });
 * @example
 * alert({
 *  message: "Would you like to answer?"
 *  title: "Question", //optional
 *  buttons: [
 *      {
 *          text: "Yes",
 *          type: AlertView.Android.ButtonType.POSITIVE,
 *          onClick: function() { 
 *              //handle yes answer here
 *          },
 *      },
 *      {
 *          text: "No",
 *          type: AlertView.Android.ButtonType.NEGATIVE,
 *          onClick: function() { 
 *              //handle no answer here
 *          },
 *      }
 *  ]});
 * @example
 * var alertView = alert({message:"this is an alert", buttons: []}); //alert without buttons
 * setTimeout(function(){alertView.dismiss();}, 2000); //closes the alert after 2 seconds
 */
function alert(options, title) {
    if (typeof options === "string") {
        options = {
            message: options
        };
    }
    else if (typeof options.message !== "string") {
        options = {
            message: String(options)
        };
    }
    if (title)
        options.title = title;

    var av = new AlertView(options);
    (System.OS === "Android") && (av.android.cancellable = false);
    var buttons = options.buttons || [{
        type: AlertView.Android.ButtonType.NEUTRAL,
        text: global.lang.ok || "OK",
        onClick: function() {}
    }];

    for (var i in buttons) {
        var b = buttons[i];
        av.addButton(b);
    }

    av.show();
}

var oldAlert = global.alert;
global.alert = alert;
