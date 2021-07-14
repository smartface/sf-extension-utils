/**
 * Apple Device utility
 * @module appleDevices
 * @type {object}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2020
 */

const Hardware = require('@smartface/native/device/hardware');
const System = require('@smartface/native/device/system');
const deviceMapping = require("./deviceMapping.json");
/**
 * Gets the human readable modelname for iphone devies.
 * Returns empty string on Android devices.
 *  @example
 * import AppleDevices from "@smartface/extension-utils/lib/appleDevices";
 * AppleDevices.getModelName();
 * @ios
 * @returns {string} Device model
 */
function getModelName() {
    return System.OS === 'iOS' ? deviceMapping[Hardware.brandModel] || "" : "";
}

module.exports = {
    getModelName
}