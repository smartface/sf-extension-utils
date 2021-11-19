/**
 * Smartface global alert replacer
 * @module alert
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2018
 */

import AlertView from "@smartface/native/ui/alertview";
import System from '@smartface/native/device/system';
import Application from '@smartface/native/application';

const ALERT_TIMEOUT = 600;

interface AlertButton {
    type: AlertView.Android.ButtonType;
    text: string;
    onClick: () => void;
}

interface AlertOptions {
    message: string;
    title?: string;
    defaultButtonText?: string;
    buttons?: AlertButton[];
}

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
 * ```
 * alert("Hello World!");
 * ```
 * @example
 * ```
 * alert({
 *  message: "message",
 *  title: "title", //optional
 *  defaultButtonText: "Okay"
 * });
 * ```
 * @example
 * ```
 * alert({
 *  message: "Would you like to answer?",
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
 * ```
 * @example
 * ```
 * const alertView = alert({ message:"this is an alert", buttons: [] }); //alert without buttons
 * setTimeout(() => alertView.dismiss(), 2000); //closes the alert after 2 seconds
 * ```
 */
function alert(options: string | AlertOptions, title?: string): AlertView {
    let paramOptions: AlertOptions = {
        message: '',
        title: title || '',
        defaultButtonText: 'OK'
    };
    const defaultButton: AlertButton = {
        type: AlertView.Android.ButtonType.NEUTRAL,
        //@ts-ignore
        text: global?.lang?.ok || 'OK',
        onClick: () => {}
    }
    let buttons: AlertButton[] = [];
    if (typeof options !== 'string') {
        const newMessage = typeof options.message !== 'string' ? String(options) : options.message;
        buttons = options.buttons || [defaultButton];
        paramOptions.message = newMessage || '';
        //@ts-ignore
        defaultButton.text = options.defaultButtonText || global?.lang?.ok || 'OK';
        paramOptions.title = options.title || '';
    }
    else {
        paramOptions.message = options;
        buttons = [defaultButton];
    }
    const alertView = new AlertView(paramOptions);
    if (System.OS === System.OSType.ANDROID) {
        alertView.android.cancellable = false;
    }
    buttons = buttons.reverse();
    buttons.forEach((button) => alertView.addButton(button));
    Application.hideKeyboard();
    /**
     * The setTimeout solution is a workaround for 
     * keyboard re-opening on alert show in iOS.
     */
    setTimeout(() => alertView.show(), ALERT_TIMEOUT);
    return alertView;
}
//@ts-ignore
const oldAlert = global.alert;
//@ts-ignore
global.alert = alert;

export = oldAlert;
