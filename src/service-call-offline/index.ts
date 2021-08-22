/**
 * Smartface Service-Call-Offline module.
 * This module provides classes to be instead of ServiceCall class for some offline capability.
 *
 * @module service-call-offline
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

import System from "@smartface/native/device/system";
import Data from "@smartface/native/global/data";
import Network from "@smartface/native/device/network";
import guid from "guid";
import copy from "copy";
import ServiceCall from "service-call";

const TABLE_NAMES = Object.freeze({
	CACHED_REQUESTS: "SF_EXTENSION_UTILS_OFFLINE_ALL_CACHED_REQUESTS",
	PENDING_REQUESTS: "SF_EXTENSION_UTILS_OFFLINE_ALL_PENDING_REQUESTS",
});

const sameReturner = (e: any) => e;
let encryptFunction;
let decryptFunction;
let isConfigured = false;

function isOnline(): Promise<void> {
	return Network.connectionType === Network.ConnectionType.NONE
		? Promise.reject()
		: Promise.resolve();
}

interface OfflineRequestOptions {
	baseUrl: string;
	logEnabled?: boolean;
	offlineRequestHandler: () => Promise<any>;
}

export const closeOfflineDatabase = sameReturner;

export class OfflineRequestServiceCall extends ServiceCall {
	offlineRequestHandler: OfflineRequestOptions["offlineRequestHandler"];
	/**
	 * Creates an OfflineRequestServiceCall helper class
	 * If there's no network connection, saves the request to perform later when
	 * network connection is available
	 * @augments ServiceCall
	 * @param {function} offlineRequestHandler - Gets request options to be modified
	 * when network connection is available and returns a promise
	 * @example
	 * ```
	 * import { OfflineRequestServiceCall } from '@smartface/extension-utils/lib/service-call-offline';
	 * sc = new OfflineRequestServiceCall({
	 *     baseUrl: "http://smartface.io",
	 *     logEnabled: true,
	 *     offlineRequestHandler: requestOptions => {
	 *         return new Promise((resolve, reject) => {
	 *             amce.createRequestOptions(amceOptions)
	 *                 .then(({ headers }) => {
	 *                     resolve(Object.assign({}, requestOptions, headers));
	 *                 });
	 *         });
	 *     }
	 * });
	 * ```
	 */
	constructor(options: OfflineRequestOptions) {
		if (!isConfigured) {
			throw Error("First you need to configure");
		}
		super(options);
		this.offlineRequestHandler = options.offlineRequestHandler;
	}

	async request(
		endpointPath: string,
		options: Parameters<typeof ServiceCall["request"]>[0]
	): Promise<any> {
		const requestOptions = this.createRequestOptions(endpointPath, options);
		try {
			await isOnline();
			return ServiceCall.request(requestOptions);
		} catch (e) {
			const requestID = guid();
			saveToTable({
				tableID: TABLE_NAMES.PENDING_REQUESTS,
				requestID,
				data: JSON.stringify(requestOptions),
			});
			return Promise.resolve(null);
		}
	}

	/**
	 * Perform all pending requests in DB
	 * @static
	 * @method
	 * @returns {Promise}
	 */
	static async sendAll(): Promise<any> {
		return Promise.resolve().then(() => {
			const allPendingRequestsString = Data.getStringVariable(
				TABLE_NAMES.PENDING_REQUESTS
			);
			const allPendingRequests = allPendingRequestsString
				? JSON.parse(allPendingRequestsString)
				: [];
			return Promise.all(
				allPendingRequests.map((requestID: string) => {
					let requestOptions = Data.getStringVariable(requestID);
					requestOptions = JSON.parse(requestOptions);
					//@ts-ignore ????
					let requestHandlerPromise = this.offlineRequestHandler
						? //@ts-ignore ????
						  this.offlineRequestHandler(copy(requestOptions))
						: Promise.resolve(requestOptions);
					return requestHandlerPromise.then((o: any) => ServiceCall.request(o));
				})
			);
		});
	}

	static clearJobs(): Promise<any> {
		return new Promise((resolve) => {
			const allPendingRequestsString = Data.getStringVariable(
				TABLE_NAMES.PENDING_REQUESTS
			);
			const allPendingRequests = allPendingRequestsString
				? JSON.parse(allPendingRequestsString)
				: [];
			allPendingRequests.forEach((requestID: string) => {
				Data.removeVariable(requestID);
			});
		});
	}
}

export class OfflineResponseServiceCall extends ServiceCall {
	private _requestCleaner: (...args: any) => any;
	/**
	 * Creates an OfflineResponseServiceCall helper class
	 * Response is served from DB then request is made to update the DB
	 *
	 * @augments ServiceCall
	 * @param {function} requestCleaner - Returns modified request options
	 * @example
	 * ```
	 * import { OfflineResponseServiceCall } from '@smartface/extension-utils/lib/service-call-offline';
	 * sc = sc || new OfflineResponseServiceCall({
	 *     baseUrl: "http://smartface.io",
	 *     logEnabled: true,
	 *     requestCleaner: requestOptions => {
	 *         delete requestOptions.headers;
	 *         return requestOptions;
	 *     }
	 * });
	 * ```
	 */
	constructor(options: {
		baseUrl: string;
		logEnabled?: boolean;
		requestCleaner: (requestOptions: {
			[key: string]: any;
		}) => { [key: string]: any };
	}) {
		if (!isConfigured) {
			throw Error("First you need to configure");
		}
		super(options);
		this._requestCleaner = options.requestCleaner;
	}

	request(
		endpointPath: string,
		options?: Parameters<typeof ServiceCall["request"]>[0]
	): Promise<any> {
		//@ts-ignore
		const requestOptions = this.createRequestOptions(endpointPath, options);
		let cleanedRequestOptions = this._requestCleaner
			? this._requestCleaner(copy(requestOptions))
			: requestOptions;
		cleanedRequestOptions = JSON.stringify(cleanedRequestOptions);

		let offlineRequest = () => {
			return new Promise((resolve, reject) => {
				let cachedResponse = Data.getStringVariable(cleanedRequestOptions);
				cachedResponse
					? resolve(JSON.parse(cachedResponse))
					: reject("No records found");
			});
		};

		let onlineRequest = () => {
			return ServiceCall.request(requestOptions).then((response) => {
				saveToTable({
					tableID: TABLE_NAMES.CACHED_REQUESTS,
					requestID: cleanedRequestOptions,
					data: JSON.stringify(response),
				});
				return response;
			});
		};

		return new Promise((resolve, reject) => {
			return offlineRequest()
				.then((e) => {
					onlineRequest(); // Make sure cache is uptodate
					resolve(e);
				})
				.catch((e) => {
					onlineRequest()
						.then(resolve)
						.catch(reject);
				});
		});
	}
}

const errorHandler = (err: any) => {
	if (err instanceof Error)
		return {
			//@ts-ignore
			title: err.type || global.lang.applicationError,
			message:
				System.OS === System.OSType.ANDROID
					? err.stack
					: err.message + "\n\n*" + err.stack,
		};
	else return err;
};

/**
 * Configures service-call-offline. Call this in your app once before using any functionality.
 * @function service-call-offline:init
 * @param {object} options configuration options
 * @param {fingerprint:CryptopgyFunction} [options.encryptionFunction] stored data is encrypted with the given function
 * @param {fingerprint:CryptopgyFunction} [options.decryptionFunction] stored data is decrypted with the given function
 * @public
 * @static
 * @example
 * ```
 * import { init } from '@smartface/extension-utils/lib/service-call-offline"'
 * import Blob = require('@smartface/native/blob');
 *
 * const basicEncrypt = plainData => {
 *     let b = Blob.createFromUTF8String(plainData);
 *     let encryptedData = b.toBase64();
 *     return encryptedData;
 * };
 *
 * const basicDecrypt = encryptedData => {
 *     let b = Blob.createFromBase64(encryptedData);
 *     let decryptedData = b.toString();
 *     return decryptedData;
 * };
 *
 * // It is recommended this to be called in app.ts:
 * init({
 *     encryptionFunction: basicEncrypt,
 *     decryptionFunction: basicDecrypt
 * });
 *```
 */
export function init(options: {
	encryptionFunction: any;
	decryptionFunction: any;
}): void {
	isConfigured = true;

	encryptFunction = options.encryptionFunction || sameReturner;
	decryptFunction = options.decryptionFunction || sameReturner;

	//@ts-ignore
	const notifier = new Network.createNotifier();
	const networkListener = async () => {
		try {
			await isOnline();
			OfflineRequestServiceCall.sendAll();
			OfflineRequestServiceCall.clearJobs();
		} finally {
		}
		networkListener();
		notifier.subscribe(networkListener);
	};
}

export function clearOfflineDatabase(): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			const allCachedRequestsString = Data.getStringVariable(
				TABLE_NAMES.CACHED_REQUESTS
			);
			const allPendingRequestsString = Data.getStringVariable(
				TABLE_NAMES.PENDING_REQUESTS
			);
			const allCachedRequests = allCachedRequestsString
				? JSON.parse(allCachedRequestsString)
				: [];
			const allPendingRequests = allPendingRequestsString
				? JSON.parse(allPendingRequestsString)
				: [];
			allCachedRequests.forEach((r: string) => Data.removeVariable(r));
			allPendingRequests.forEach((r: string) => Data.removeVariable(r));
			resolve();
		} catch (e) {
			reject(e);
		}
	});
}

function saveToTable(opts: { tableID: string, requestID: string, data: string }): Promise<void> {
	return new Promise((resolve, reject) => {
			try {
					const allRequestsString = Data.getStringVariable(opts.tableID);
					const allRequests = allRequestsString ? JSON.parse(allRequestsString) : [];
					allRequests.push(opts.requestID);
					const allRequestsStringified = JSON.stringify(allRequests);
					Data.setStringVariable(opts.tableID, allRequestsStringified);
					Data.setStringVariable(opts.requestID, opts.data);
					resolve();
					console.info("[SC_OFFLINE] Successfully saved ", opts.requestID, opts.data);
			}
			catch (ex) {
					console.error("[SC_OFFLINE] Failed to save ", opts.requestID, opts.data, errorHandler(ex));
					reject(ex);
			}
	});
}
