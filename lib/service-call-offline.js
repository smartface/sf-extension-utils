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
const System = require("sf-core/device/system");
const Data = require("sf-core/data");
const ServiceCall = require("./service-call");
const Network = require("sf-core/device/network");
const { createAsyncTask } = require("./async");
const guid = require("./guid");
const copy = require("./copy");
const TABLE_NAMES = Object.freeze({
    REQUESTS: "requests",
    RESPONSES: "responses",
    PENDING_REQUESTS: "pending"
});
var sameReturner = e => e;
var encryptFunction;
var decryptFunction;
var isConfigured;

const isOnline = () => {
    return new Promise((resolve, reject) => {
        Network.connectionType === Network.ConnectionType.NONE ? reject() : resolve();
    });
};

class OfflineRequestServiceCall extends ServiceCall {
    /**
     * Creates an OfflineRequestServiceCall helper class
     * If there's no network connection, saves the request to perform later when 
     * network connection is available
     * @augments ServiceCall
     * @param {function} offlineRequestHandler - Gets request options to be modified 
     * when network connection is available and returns a promise
     * @example
     * const { OfflineRequestServiceCall } = require("sf-extension-utils/lib/service-call-offline");
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
     */
    constructor(options) {
        if (!isConfigured)
            throw Error("First you need to configure");

        super(options);
        this.offlineRequestHandler = options.offlineRequestHandler;
    }

    request(endpointPath, options) {
        let requestOptions = this.createRequestOptions(endpointPath, options);
        return isOnline()
            .then(() => ServiceCall.request(requestOptions))
            .catch(() => {
                let requestID = guid();
                saveToTable({
                    tableID: "SF_EXTENSION_UTILS_OFFLINE_ALL_PENDING_REQUESTS",
                    requestID,
                    data: JSON.stringify(requestOptions)
                });
                return Promise.resolve(null);
            });
    }

    /**
     * Perform all pending requests in DB
     * @static
     * @method
     * @returns {Promise} 
     */
    static sendAll() {
        return Promise.resolve();
        return Promise.resolve().then(() => {
            //offlineRequestHandler
            return Promise.all(promises);
        });
    }

    static clearJobs() {
        return new Promise(resolve => {

        });
    }
}

class OfflineResponseServiceCall extends ServiceCall {
    /**
     * Creates an OfflineResponseServiceCall helper class
     * Response is served from DB then request is made to update the DB
     * 
     * @augments ServiceCall
     * @param {function} requestCleaner - Returns modified request options
     * @example
     * const { OfflineResponseServiceCall } = require("sf-extension-utils/lib/service-call-offline");
     * sc = sc || new OfflineResponseServiceCall({
     *     baseUrl: "http://smartface.io",
     *     logEnabled: true,
     *     requestCleaner: requestOptions => {
     *         delete requestOptions.headers;
     *         return requestOptions;
     *     }
     * });     
     */
    constructor(options) {
        if (!isConfigured)
            throw Error("First you need to configure");
        super(options);
        this.requestCleaner = options.requestCleaner;
    }

    request(endpointPath, options) {
        const requestOptions = this.createRequestOptions(endpointPath, options);
        let cleanedRequestOptions = this.requestCleaner ? this.requestCleaner(copy(requestOptions)) : requestOptions;
        cleanedRequestOptions = JSON.stringify(cleanedRequestOptions);

        let offlineRequest = () => {
            return new Promise((resolve, reject) => {
                let cachedResponse = Data.getStringVarible(cleanedRequestOptions);
                cachedResponse ? resolve(JSON.parse(decryptFunction(cachedResponse))) : reject("No records found");
            });
        };

        let onlineRequest = () => {
            return ServiceCall.request(requestOptions)
                .then(response => {
                    saveToTable({
                        tableID: "SF_EXTENSION_UTILS_OFFLINE_ALL_CACHED_REQUESTS",
                        requestID: cleanedRequestOptions,
                        data: JSON.stringify(response)
                    });
                    return response;
                });
        };

        return new Promise((resolve, reject) => {
            return offlineRequest()
                .then(e => {
                    onlineRequest(); // Make sure cache is uptodate
                    return e;
                })
                .catch(onlineRequest);
        });
    }
}

const errorHandler = err => {
    if (err instanceof Error)
        return {
            title: err.type || global.lang.applicationError,
            message: System.OS === "Android" ? err.stack : (err.message + "\n\n*" + err.stack)
        };
    else
        return err;
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
 * const { init } = require("sf-extension-utils/lib/service-call-offline");
 * const Blob = require('sf-core/blob');
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
 * // It is recommended this to be called in app.js:
 * init({
 *     encryptionFunction: basicEncrypt,
 *     decryptionFunction: basicDecrypt
 * });
 * 
 */
function init(options = {}) {
    isConfigured = true;

    encryptFunction = options.encryptionFunction || sameReturner;
    decryptFunction = options.decryptionFunction || sameReturner;

    var notifier = new Network.createNotifier();
    var networkListener = connectionType => {
        isOnline()
            .then(() => OfflineRequestServiceCall.sendAll())
            .then(() => OfflineRequestServiceCall.clearJobs());
    };
    networkListener();
    notifier.subscribe(networkListener);
}

function clearOfflineDatabase() {
    return new Promise((resolve, reject) => {
        try {
            let allCachedRequests = Data.getStringVarible("SF_EXTENSION_UTILS_OFFLINE_ALL_CACHED_REQUESTS");
            let allPendingRequests = Data.getStringVarible("SF_EXTENSION_UTILS_OFFLINE_ALL_PENDING_REQUESTS");
            allCachedRequests = allCachedRequests ? JSON.parse(allCachedRequests) : [];
            allPendingRequests = allPendingRequests ? JSON.parse(allPendingRequests) : [];
            allCachedRequests.forEach(r => Data.removeVariable(r));
            allPendingRequests.forEach(r => Data.removeVariable(r));
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}

function saveToTable({ tableID, requestID, data }) {
    return new Promise((resolve, reject) => {
        try {
            let allRequests = Data.getStringVarible(tableID);
            allRequests = allRequests ? JSON.parse(allRequests) : [];
            allRequests.push(requestID);
            allRequests = JSON.stringify(allRequests);
            Data.setStringVariable(tableID, allRequests);
            Data.setStringVariable(requestID, encryptFunction(data));
            resolve();
            console.info("[SC_OFFLINE] Successfully saved ", requestID, data);
        }
        catch (ex) {
            console.error("[SC_OFFLINE] Failed to save ", requestID, data, errorHandler(ex));
            reject(ex);
        }
    });
}

Object.assign(exports, {
    init,
    OfflineRequestServiceCall,
    OfflineResponseServiceCall,
    clearOfflineDatabase,
    closeOfflineDatabase: sameReturner
});
