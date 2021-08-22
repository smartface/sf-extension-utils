/**
 * @module network
 * @type {Object}
 * @author Yunus Atmaca <yunus.atmaca@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

import Network from "@smartface/native/device/network";
import Http from "@smartface/native/net/http";

/**
 * @function
 * @return {Promise<Object>} - Resolves if the internet connectivity is available,
 * rejects o/w
 * @example
 * ```
 * import network from '@smartface/extension-utils/lib/network';
 * network.isConnected()
 *     .then(() => {
 *         console.info("Connected to internet");
 *     })
 *     .catch(() => {
 *         console.error("Not connected to internet");
 *     });
 * ```
 */
export function isConnected(): Promise<{ [key: string]: any }> {
	return new Promise((resolve, reject) => {
		const noConnection = Network.connectionType === Network.ConnectionType.NONE;
		if (noConnection) {
			return reject();
		}
		const http = new Http();
		//@ts-ignore
		http.request({
			url: "https://www.google.com",
			onLoad: (e) => {
				resolve(e);
			},
			onError: (e) => {
				if (typeof e.statusCode === "undefined") {
					reject(e);
				} else {
					resolve(e);
				}
			},
		});
	});
}

/**
 * @function
 * @return {Promise<string>} - Resolves current IP address of the device
 * @example
 * ```
 * import network from "@smartface/extension-utils/lib/network";
 * network.getIpAddress()
 *     .then((ip) => {
 *         console.info(`Retrieved device IP ${ip}`);
 *     })
 *     .catch(() => {
 *         console.error("Cannot retrieve device IP");
 *     });
 * ```
 */
export function getIpAddress(): Promise<string> {
	return new Promise((resolve, reject) => {
		const http = new Http();
		http.requestString({
			url: "http://www.dyndns.org/cgi-bin/check_ip.cgi",
			//@ts-ignore
			method: "GET",
			//@ts-ignore
			onLoad: (response) => resolve(response.string.replace(/[^0-9.]/g, "")),
			onError: (err) => reject(err),
		});
	});
}
