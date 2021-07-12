/**
 * Determine if the current running platform is Smartface Emulator or published application
 * @module guid
 * @type {function}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 */

/**
 * Creates a UUID v4 string
 * @method
 * @public
 * @returns {boolean} true if the current platform is Smartface Emulator
 * @example
 * import isEmulator from 'sf-extension-utils/lib/isemulator';
 * if(isEmulator()) {
 *  console.info("Device is Smartface Emulator");
 * }
 */
export default function(): boolean;
