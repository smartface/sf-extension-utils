/**
 * Apple Device utility
 * @module appleDevices
 * @type {object}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2020
 */

/**
 * Gets the human readable modelname for iphone devies.
 * Returns empty string on Android devices.
 * @ios
 * @returns {string} Device model
 */
export function getModelName(): string;