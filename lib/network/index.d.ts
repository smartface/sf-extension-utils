/**
 * @module network
 * @type {Object}
 * @author Yunus Atmaca <yunus.atmaca@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

/**
 * @function
 * @return {Promise<Object>} - Resolves if the internet connectivity is available,
 * rejects o/w
 * @example
 * import network from 'sf-extension-utils/lib/network';
 * network.isConnected()
 *     .then(() => {
 *         console.info("Connected to internet");
 *     })
 *     .catch(() => {
 *         console.error("Not connected to internet");
 *     });
 */
export function isConnected(): Promise<object>;