/**
 * @module isEmulator
 * @type {function}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 */

const Application = require('@smartface/native/application');
const System = require('@smartface/native/device/system');

/**
 * Determine if the current running platform is Smartface Emulator or published application
 * @method
 * @public
 * @returns {boolean} true if the current platform is Smartface Emulator
 * @example
 * import isEmulator from '@smartface/extension-utils/lib/isEmulator';
 * if(isEmulator()) {
 *  console.info("Device is Smartface Emulator");
 * }
 */
function isEmulator() {
    if (System.OS === 'iOS') {
        return Application.ios.bundleIdentifier === "io.smartface.SmartfaceEnterpriseApp";
    }
    const AndroidConfig = require('@smartface/native/util/Android/androidconfig');
    return AndroidConfig.isEmulator;
}

module.exports = exports = isEmulator;