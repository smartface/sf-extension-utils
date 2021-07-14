/**
 *
 * @module isEmulator
 * @type {function}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 */

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
export default function(): boolean;
