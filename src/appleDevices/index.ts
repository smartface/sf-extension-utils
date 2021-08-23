/**
 * Apple Device utility
 * @module appleDevices
 * @type {object}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2020
 */

import Hardware from '@smartface/native/device/hardware';
import System from '@smartface/native/device/system';
import deviceMapping from './deviceMapping.json';
/**
 * Gets the human readable modelname for iphone devies.
 * Returns empty string on Android devices.
 * @example
 * ```
 * import AppleDevices from "@smartface/extension-utils/lib/appleDevices";
 * AppleDevices.getModelName();
 * ```
 * @ios
 * @returns {string} Device model
 */
export function getModelName(): string {
	return System.OS === 'iOS' ? (deviceMapping as any)[Hardware.brandModel] || '' : '';
}