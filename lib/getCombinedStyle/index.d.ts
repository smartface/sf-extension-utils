/**
 * Smartface combilned style util
 * @module getCombinedStyle
 * @type {function}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */

/**
 * Creates a style object from a context class. Results are cached. If same className is matched, result is given from a cache. Cache not cleared on context change!
 * @public
 * @method
 * @params {string} className - One or more class names seperated with space
 * @returns {object} Style object generated from cache
 * @example
 * import { getCombinedStyle } from '@smartface/extension-utils/lib/getCombinedStyle';
 * const buttonStyle = getCombinedStyle(".button");
 * Object.assign(btn, buttonStyle);
 */
export function getCombinedStyle<T>(className: string): { [key: string]: any };

/**
 * Removes all items from cache
 * @public
 * @method
 * @example
 * import { clearCache } from '@smartface/extension-utils/lib/getCombinedStyle';
 * function onContextChangeEvent() {
 *  clearCache();
 * }
 */
export function clearCache(): void;