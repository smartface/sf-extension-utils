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
import guid from "../guid";
import copy from "../copy";
import ServiceCall from "../service-call";

const TABLE_NAMES = Object.freeze({
	CACHED_REQUESTS: "SF_EXTENSION_UTILS_OFFLINE_ALL_CACHED_REQUESTS",
	PENDING_REQUESTS: "SF_EXTENSION_UTILS_OFFLINE_ALL_PENDING_REQUESTS",
});

const sameReturner = (e: any) => e;
let encryptFunction;
let decryptFunction;
let isConfigured = false;

async function isOnline(): Promise<void> {
	const isOnline = Network.connectionType === Network.ConnectionType.NONE;
	return isOnline ? Promise.resolve() : Promise.reject();
}

interface OfflineRequestOptions {
	offlineRequestHandler?<T = any>(e: T): Promise<T>;
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
	constructor(options: OfflineRequestOptions & ConstructorParameters<typeof ServiceCall>['0']) {
		if (!isConfigured) {
			throw Error("First you need to configure");
		}
		super(options);
		this.offlineRequestHandler = options.offlineRequestHandler || ((e: any) => Promise.resolve(e));

			//@ts-ignore
		const notifier = new Network.createNotifier();
		const networkListener = async () => {
			try {
				await isOnline();
				this.sendAll();
				this.clearJobs();
			} finally {
			}
			networkListener();
			notifier.subscribe(networkListener);
		}
	}

	async request(
		endpointPath: string,
		options: Parameters<ServiceCall["request"]>[1]
	): Promise<any> {
		const requestOptions = this.createRequestOptions(endpointPath, options);
		try {
			await isOnline();
			return super.request(endpointPath, options);
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
	async sendAll(): Promise<any> {
		return Promise.resolve().then(() => {
			const allPendingRequestsString = Data.getStringVariable(
				TABLE_NAMES.PENDING_REQUESTS
			);
			const allPendingRequests = allPendingRequestsString
				? JSON.parse(allPendingRequestsString)
				: [];
			return Promise.all(
				allPendingRequests.map((requestID: string) => {
					const requestOptions = Data.getStringVariable(requestID);
					const requestOptionsAsJSON = JSON.parse(requestOptions);
					const requestHandlerPromise = this.offlineRequestHandler ? this.offlineRequestHandler(copy(requestOptionsAsJSON)) : Promise.resolve();
					return requestHandlerPromise.then((o: any) => this.request(this.baseUrl, requestOptionsAsJSON));
				})
			);
		});
	}

	private clearJobs(): Promise<any> {
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
	private _requestCleaner: OfflineRequestOptions['offlineRequestHandler'];
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
		requestCleaner: OfflineRequestOptions['offlineRequestHandler'];
		encryptionFunction: (e: any) => any;
		decryptionFunction: (e: any) => any;
	}) {
		if (!isConfigured) {
			throw Error("First you need to configure");
		}
		super(options);
		this._requestCleaner = options.requestCleaner || ((e: any) => Promise.resolve(e));
	}

	request(
		endpointPath: string,
		options?: Parameters<ServiceCall["request"]>[1]
	): Promise<any> {
		//@ts-ignore
		const requestOptions = this.createRequestOptions(endpointPath, options);
		const cleanedRequestOptions = this._requestCleaner ? this._requestCleaner(copy(requestOptions)) : requestOptions;
		const cleanedRequestOptionsAsString = JSON.stringify(cleanedRequestOptions);

		let offlineRequest = () => {
			return new Promise((resolve, reject) => {
				let cachedResponse = Data.getStringVariable(cleanedRequestOptionsAsString);
				cachedResponse
					? resolve(JSON.parse(cachedResponse))
					: reject("No records found");
			});
		};

		let onlineRequest = () => {
			return this.request(endpointPath, options).then((response) => {
				saveToTable({
					tableID: TABLE_NAMES.CACHED_REQUESTS,
					requestID: cleanedRequestOptionsAsString,
					data: JSON.stringify(response),
				});
				return response;
			});
		};

		return new Promise((resolve, reject) => {
			return offlineRequest()
				.then((e) => {
					onlineRequest(); // Make sure cache is up to date
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
