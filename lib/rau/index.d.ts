/**
 * Smartface Remote App Update module
 * @module rau
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

/**
 * Checks RAU updates. If there is new update available, the update dialog will be shown to the user 
 * if silent parameter not given. This function will handle permission operations internally for Android. 
 * @function rau:checkUpdate
 * @param {object} [options]
 * @param {boolean} [options.showProgressCheck = false] Show dialog while checking updates.
 * @param {boolean} [options.showProgressErrorAlert = false] Show error dialog when error accurs.
 * @param {boolean} [options.silent = false] Update and restart without interacting with user.
 * @param {string} [options.url] to open for incompatible updates (optional)
 * @param {string} [options.user] information to be logged in RAU server for analytics
 * @param {function} [options.onBeforeRestart] callback event to fire just before restarting. After the syncrous call, app automatically restarts.
 * @static
 * @public
 * @see {@link https://developer.smartface.io/docs/remote-app-update|Remote App Update Guide}
 * @example
 * import System = require("@smartface/native/device/system");
 * import rau from 'sf-extension-utils/lib/rau';
 * rau.checkUpdate({
 *  showProgressCheck: true,
 *  showProgressErrorAlert: true,
 *  silent: false,
 *  url: System.OS === "Android"? androidURL: iOSURL
 * });
 */
export function checkUpdate(options: {
    showProgressCheck?: boolen;
    showProgressErrorAlert?: boolean;
    silent?: boolean;
    url?: string;
    user?: string;
    onBeforeRestart?: () => {}
} = {
    showProgressCheck = false,
    showProgressErrorAlert = false,
    silent = false
}): void;