/**
 * Smartface Settings module
 * @module settings
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

const System = require("sf-core/device/system");
const Application = require("sf-core/application");
const isIOS = System.OS === "iOS";

/**
 * Opens application settings menu
 * @static
 * @method
 * @returns {Promise} 
 * @example
 * const { openApplicationSettings } = require("sf-extension-utils/lib/settings");
 * openApplicationSettings();
 *
 */
function openApplicationSettings() {
    return new Promise((resolve, reject) => {
        let options = {
            uriScheme: isIOS ? "app-settings:" : "package:" + Application.android.packageName,
            onSuccess: e => { resolve(e) },
            onFailure: e => { reject(e) }
        };
        !isIOS && (options.action = "android.settings.APPLICATION_DETAILS_SETTINGS");
        Application.call(options);
    });
}

module.exports = exports = {
    openApplicationSettings
};
