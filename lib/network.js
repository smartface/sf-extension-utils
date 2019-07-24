/**
 * @module network
 * @type {Object}
 * @author Yunus Atmaca <yunus.atmaca@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

const Http = require("sf-core/net/http");
const Network = require("sf-core/device/network");

/**
 * @function
 * @return {Promise<Object>} - Resolves if the internet connectivity is available,
 * rejects o/w
 * @example
 * const network = require("sf-extension-utils/lib/network");
 * network.isConnected()
 *     .then(() => {
 *         console.info("Connected to internet");
 *     })
 *     .catch(() => {
 *         console.error("Not connected to internet");
 *     });
 */
function isConnected() {
    return new Promise((resolve, reject) => {
        let noConnection = Network.connectionType === Network.ConnectionType.NONE;
        if (noConnection) {
            return reject();
        }

        let http = new Http();
        http.request({
            url: 'https://www.google.com',
            onLoad: e => { resolve(e) },
            onError: e => {
                if (typeof e.statusCode === "undefined")
                    reject(e);
                else
                    resolve(e);
            }
        });
    });
}

exports.isConnected = isConnected;
