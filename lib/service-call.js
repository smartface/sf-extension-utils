/**
 * Smartface Service-Call helper module
 * @module service-call
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

"use strict";
const Http = require("sf-core/net/http");
const httpMap = new WeakMap();
const optionsMap = new WeakMap();
const mixinDeep = require('mixin-deep');
const copy = require("./copy");
const METHODS_WITHOUT_BODY = ["GET", "HEAD"];
const BASE_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Accept-Language": global.Device.language,
    "Cache-Control": "no-cache"
};
Object.freeze(BASE_HEADERS);
const queryString = require('query-string');
const reHTTPUrl = /^http(s?):\/\//i;

/**
 * Helper class for calling JSON based restful services.
 * @public
 * @example
 * //shared service-call.js file
 * const ServiceCall = require("sf-extension-utils/service-call");
 * const sc = new ServiceCall({
 *     baseUrl: "http://api.myBaseUrl.com",
 *     logEnabled: true,
 *     headers: {
 *        apiVersion: "1.0"
 *     }
 * });
 * module.exports = exports = sc;
 * 
 * 
 * // services/user.js
 * const sc = require("./serviceConfig");
 * 
 * Object.assign(exports, {
 *     login
 * });
 * 
 * function login(userName, password) {
 *     return new Promise((resolve, reject) => {
 *         sc.request(`/auth/login?emine=3`, {
 *             method: "POST",
 *             body: {
 *                 userName,
 *                 password
 *             }
 *         }).then(response => {
 *             sc.setHeader("Authorization", "Bearer " + response.token);
 *             resolve(response);
 *         }).catch(err => {
 *             reject(err);
 *         });
 *     });
 * }
 * 
 * 
 * // pages/pgLogin.js
 * const userService = require("../services/user");
 * 
 * page.btnLogin.onPress = () => {
 *      userService.login(page.tbUserName.text, page.tbPassword.text).then(()=> {
 *         Rouger.go("pgDashboard"); 
 *      }).catch(()=> {
 *          alert("Cannot login");
 *      });
 * };
 * 
 */
class ServiceCall {
    /**
     * Creates a ServiceCall helper class with common configuration to be used across multiple service calls.
     * @param {object} options - Cofiguration of service call helper object (required)
     * @param {string} options.baseUrl - Base URL of all future service calls (required)
     * @param {number} [options.timeout = 60000] - Timeout value for service calls. If not provided it uses the default timeout value from sf-core http
     * @param {boolean} [options.logEnabled = false] - Logs the service requests & responses to console
     * @param {object} [options.headers] - Sets the default headers for this configuration
     * @example
     * const ServiceCall = require("sf-extension-utils/service-call");
     * const sc = new ServiceCall({
     *     baseUrl: "http://smartface.io",
     *     logEnabled: false,
     *     headers: {
     *        apiVersion: "1.0"
     *     }
     * })
     */
    constructor(options) {
        options = copy(options);
        options.baseUrl = options.baseUrl || options.baseURL;
        const httpOptions = {};
        if (options.timeout)
            httpOptions.timeout = options.timeout;
        const http = new Http(httpOptions);
        httpMap.set(this, http);
        optionsMap.set(this, options);

    }
    
    /**
     * Sets headers for this configuration. Either sets one by each call or sets them in bulk
     * @method
     * @param {string} key - Header name to set
     * @param {string} value - Value to set of the key. If value is not a string, key is removed from header
     * @param {object} headers - headers object to set multipe header values at once
     * @example
     * //After login
     * sc.setHeader("Authorization", "Basic 12345");
     * @example
     * //After logout
     * sc.setHeader("Authorization");
     * @example
     * // set multiple headers at once
     * sc.setHeader({
     *  environment: "test",
     *  apiVersion: "1.2"  //replaces the existing
     * });
     */
    setHeader(key, value) {
        const serviceCallOptions = optionsMap.get(this);
        if (typeof key === "object") {
            for (let k in key) {
                let v = key[k];
                this.setHeader(k, v);
            }
        }
        else if (typeof key === "string") {
            if (value) {
                serviceCallOptions.headers[key] = String(value);
            }
            else
                delete serviceCallOptions.headers[key];
        }
        else
            throw Error("key must be string or object");
    }
    
    /**
     * Gets a copy of headers used
     * @method
     * @returns {object} headers
     */
    getHeaders() {
        const serviceCallOptions = optionsMap.get(this);
        return copy(serviceCallOptions.headers);
    }
    
    /**
     * creates a request options object for http request
     * @method
     * @param {string} endpointPath - Added to the end of the base url to form the url
     * @param {object} options - Request specific options
     * @param {string} method - HTTP method of this request
     * @param {object} [options.body] - Request payload body. This object will be automatically stringified
     * @param {object} [options.q] - Query string string object. Combines with the url
     * @param {object} [options.query] - Alias for options.q
     * @param {object} [options.headers] - Request specific headers. In conflict with configuration, those values are used
     * @param {boolean} [options.logEnabled] - Request specific log option
     * @param {string} [options.user] - Basic authentication user. Must be used with options.password
     * @param {string} [options.password] - Basic authentication password. Must be used with options.user
     * @returns {object} http request object
     * @example
     * var reqOps = sc.createRequestOptions(`/auth/login`, {
     *        method: "POST",
     *        body: {
     *            userName,
     *            password
     *        },
     *        headers: {
     *            "Content-Type": "application/json"
     *        }
     *    });
     *    ServiceCall.request(reqOps).then((result) => {
     *        //logic
     *    }).catch((err) => {
     *        //logic
     *    });
     */
    createRequestOptions(endpointPath, options) {
        const serviceCallOptions = optionsMap.get(this);
        if (!serviceCallOptions)
            throw Error("This ServiceCall instnace is not configured");
        var url = String(serviceCallOptions.baseUrl + endpointPath);
        if (!reHTTPUrl.test(url))
            throw Error(`URL is not valid for http(s) request: ${url}`);
        var requestOptions = mixinDeep({
            url,
            headers: serviceCallOptions.headers,
            logEnabled: !!serviceCallOptions.logEnabled,
        }, options || {});
        return requestOptions;
    }
    
    /**
     * Combines serviceCall.createRequestOptions and ServiceCall.request (static)
     * @method
     * @param {string} endpointPath - Added to the end of the base url to form the url
     * @param {object} options - Request specific options
     * @param {string} method - HTTP method of this request
     * @param {object} [options.body] - Request payload body. This object will be automatically stringified
     * @param {object} [options.q] - Query string string object. Combines with the url
     * @param {object} [options.query] - Alias for options.q
     * @param {object} [options.headers] - Request specific headers. In conflict with configuration, those values are used
     * @param {boolean} [options.logEnabled] - Request specific log option
     * @param {string} [options.user] - Basic authentication user. Must be used with options.password
     * @param {string} [options.password] - Basic authentication password. Must be used with options.user
     * @returns {Promise} 
     * @see ServiceCall.createRequestOptions
     * @see ServiceCall.request
     * @example
     * function login(userName, password) {
     *      return sc.request("/auth/login", {
     *          method: "POST",
     *          body: {
     *              userName,
     *              password
     *          }
     *      });
     *  }
     */
    request(endpointPath, options) {
        const requestOptions = this.createRequestOptions(endpointPath, options);
        return ServiceCall.request(requestOptions);
    }

    /**
     * Performs a service call and returns a promise to handle
     * @static
     * @method
     * @param {object} options - Request specific options
     * @param {string} method - HTTP method of this request
     * @param {string} url - Full Http url
     * @param {object} [options.body] - Request payload body. This object will be automatically stringified
     * @param {object} [options.headers] - Full request headers
     * @param {boolean} [options.logEnabled] - Request specific log option
     * @param {string} [options.user] - Basic authentication user. Must be used with options.password
     * @param {string} [options.password] - Basic authentication password. Must be used with options.user
     * @returns {Promise} 
     * @example
     * var reqOps = sc.createRequestOptions(`/auth/login`, {
     *        method: "POST",
     *        body: {
     *            userName,
     *            password
     *        },
     *        headers: {
     *            "Content-Type": "application/json"
     *        }
     *    });
     *    ServiceCall.request(reqOps).then((result) => {
     *        //logic
     *    }).catch((err) => {
     *        //logic
     *    });
     */
    static request(options) {
        const http = options.http || new Http();
        var query = options.q || options.query;
        options.url = String(options.url);
        if (query) {
            let urlParts = options.url.split("?");
            let q = Object.assign(queryString.parse(urlParts[1]), query);
            let qString = queryString.stringify(q);
            urlParts[1] = qString;
            options.url = urlParts.join("?");
        }
        return new Promise((resolve, reject) => {
            var requestOptions = mixinDeep({
                onLoad: function(response) {
                    try {
                        response.logEnabled = !!options.logEnabled;
                        bodyParser(response);
                        if (response.body.success === false)
                            reject(response.body);
                        else
                            resolve(response.body);
                    }
                    catch (ex) {
                        reject(ex);
                    }
                },
                onError: function(e) {
                    e.headers = e.headers || {};
                    e.body = e.body || "";
                    e.logEnabled = !!options.logEnabled;
                    bodyParser(e);
                    reject(e);
                }
            }, options);
            if (METHODS_WITHOUT_BODY.indexOf(requestOptions.method) !== -1) {
                if (requestOptions.body) {
                    delete requestOptions.body;
                }
                if (requestOptions.headers["Content-Type"])
                    delete requestOptions.headers["Content-Type"];
                options.logEnabled && console.log(`request: ${JSON.stringify(requestOptions, null, "\t")}`);
            }
            else {
                options.logEnabled && console.log(`request: ${JSON.stringify(requestOptions, null, "\t")}`);
                if (requestOptions.body && typeof requestOptions.body === "object" &&
                    requestOptions.headers["Content-Type"].startsWith("application/json")) {
                    requestOptions.body = JSON.stringify(requestOptions.body);
                }
            }

            http.request(requestOptions);
        });
    }
    
    /**
     * Default values of headers
     * @static
     * @readonly
     * @property {object} header object
     */
    static get BASE_HEADERS() { return BASE_HEADERS; }

}

function bodyParser(response) {
    const contentType = (response.headers && getContentType(response.headers)) || "";
    switch (true) {
        case !contentType.startsWith("image"):
            response.body = response.body.toString();

        case contentType === "application/json":
            try {
                response.body = JSON.parse(response.body);
                response.logEnabled && console.log(`Response body = ${JSON.stringify(response.body, null, "\t")}`);
            }
            catch (ex) {
                response.logEnabled && console.log(`Response is not a  JSON\nResponse Body = ${response.body}`);
            }
            break;
    }
}

function getContentType(headers = {}) {
    var contentType = headers["Content-Type"];
    if (!contentType) {
        for (let h in headers) {
            if (h.toLowerCase() === "content-type") {
                contentType = headers[h];
                break;
            }
        }
    }
    return contentType;
}

module.exports = exports = ServiceCall;
