/**
 * Smartface Service-Call helper module
 * @module service-call
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

"use strict";
const Http = require("sf-core/net/http");
const httpMap = new WeakMap();
const optionsMap = new WeakMap();
const mixinDeep = require('mixin-deep');
const copy = require("../copy");
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
const { createAsyncGetter } = require("../async");
const getHttp = createAsyncGetter(() => new Http());
const reParseBodyAsText = /(?:application\/(?:x-csh|json|javascript|rtf|xml)|text\/.*|.*\/.*(:?\+xml|xml\+).*)/i;
const reJSON = /^application\/json/i;

/**
 * Helper class for calling JSON based restful services.
 * @public
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
     * 
     * // Shared service-call.js file
     * import ServiceCall from "sf-extension-utils/lib/service-call";
     * const sc = new ServiceCall({
     *     baseUrl: "http://api.myBaseUrl.com",
     *     logEnabled: true,
     *     headers: {
     *        apiVersion: "1.0"
     *     }
     * });
     * module.exports = exports = sc;
     * 
     * // services/user.js
     * import sc from "service/serviceConfig";
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
     * import userService from "services/user";
     * 
     * page.btnLogin.onPress = () => {
     *      userService.login(page.tbUserName.text, page.tbPassword.text).then(()=> {
     *         Router.go("pgDashboard"); 
     *      }).catch(()=> {
     *          alert("Cannot login");
     *      });
     * };
     */
    constructor(options) {
        options = copy(options);
        options.baseUrl = options.baseUrl || "";
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
        const serviceCallOptions = copy(optionsMap.get(this));
        return serviceCallOptions.headers;
    }

    /**
     * Base URL for this service-call library uses. This can be get and set
     * @property {string} baseUrl
     */
    get baseUrl() {
        const serviceCallOptions = copy(optionsMap.get(this));
        return serviceCallOptions.baseUrl;
    }

    set baseUrl(value) {
        const serviceCallOptions = copy(optionsMap.get(this));
        serviceCallOptions.baseUrl = value;
        optionsMap.set(this, serviceCallOptions);
        return value;
    }

    /**
     * creates a request options object for http request
     * @method
     * @param {string} endpointPath - Added to the end of the base url to form the url
     * @param {object} options - Request specific options
     * @param {string} [options.method] - HTTP method of this request
     * @param {object} [options.body] - Request payload body. This object will be automatically stringified
     * @param {object} [options.q] - Query string string object. Combines with the url
     * @param {object} [options.query] - Alias for options.q
     * @param {object} [options.headers] - Request specific headers. In conflict with configuration, those values are used
     * @param {boolean} [options.logEnabled] - Request specific log option
     * @param {string} [options.user] - Basic authentication user. Must be used with options.password
     * @param {string} [options.password] - Basic authentication password. Must be used with options.user
     * @param {boolean} [options.fullResponse=false] - Resolved promise contains full response including `headers`, `body` and `status`
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
        const serviceCallOptions = copy(optionsMap.get(this));
        if (!serviceCallOptions)
            throw Error("This ServiceCall instnace is not configured");
        let url = String(serviceCallOptions.baseUrl + endpointPath);
        if (!reHTTPUrl.test(url))
            throw Error(`URL is not valid for http(s) request: ${url}`);
        let requestOptions = mixinDeep({
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
     * @param {string} [options.method] - HTTP method of this request
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
     * @param {string} options.method - HTTP method of this request
     * @param {string} options.url - Full Http url
     * @param {object} [options.body] - Request payload body. This object will be automatically stringified
     * @param {object} [options.headers] - Full request headers
     * @param {boolean} [options.logEnabled] - Request specific log option
     * @param {string} [options.user] - Basic authentication user. Must be used with options.password
     * @param {string} [options.password] - Basic authentication password. Must be used with options.user
     * @param {boolean} [options.fullResponse=false] - Resolved promise contains full response including `headers`, `body` and `status`
     * @returns {Promise} 
     * @example
     * const reqOps = sc.createRequestOptions(`/auth/login`, {
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
        options = Object.assign({}, options);
        let { fullResponse = false } = options;
        let query = options.q || options.query;
        options.url = String(options.url);
        if (query) {
            let urlParts = options.url.split("?");
            let q = Object.assign(queryString.parse(urlParts[1]), query);
            let qString = queryString.stringify(q);
            urlParts[1] = qString;
            options.url = urlParts.join("?");
        }

        return new Promise((resolve, reject) => {
            let requestOptions = mixinDeep({
                onLoad: response => {
                    try {
                        response.logEnabled = !!options.logEnabled;
                        bodyParser(options.url, response);
                        if (response.body && response.body.success === false)
                            reject(fullResponse ? response : response.body);
                        else
                            resolve(fullResponse ? response : response.body);
                    }
                    catch (ex) {
                        reject(ex);
                    }
                },
                onError: e => {
                    e.logEnabled = !!options.logEnabled;
                    bodyParser(options.url, e);
                    reject(e);
                },
                headers: {}
            }, options);
            if (METHODS_WITHOUT_BODY.indexOf(requestOptions.method) !== -1) {
                if (requestOptions.body) {
                    delete requestOptions.body;
                }
                if (requestOptions.headers && requestOptions.headers["Content-Type"])
                    delete requestOptions.headers["Content-Type"];
                options.logEnabled && console.log("request", requestOptions);
            }
            else {
                options.logEnabled && console.log("request", requestOptions);
                if (requestOptions.body && typeof requestOptions.body === "object") {
                    if (requestOptions.headers["Content-Type"].startsWith("application/json")) {
                        requestOptions.body = JSON.stringify(requestOptions.body);
                    }
                    else if (requestOptions.headers["Content-Type"].includes("x-www-form-urlencoded")) {
                        requestOptions.body = convertObjectToFormData(requestOptions.body);
                    }
                }
            }

            getHttp()
                .then(http => {
                    requestOptions.timeout && (http.timeout = requestOptions.timeout);
                    http.request(requestOptions);
                })
                .catch(reject);
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

function bodyParser(requestUrl, response) {
    const contentType = (response.headers && getContentType(response.headers)) || "";
    reJSON.lastIndex = reParseBodyAsText.lastIndex = 0;
    if (reParseBodyAsText.test(contentType))
        response.body = response.body.toString();
    response.body = response.body || "{}";

    if (reJSON.test(contentType)) {
        try {
            response.body = JSON.parse(response.body);
            response.logEnabled && console.log("Request url ", requestUrl, " Response body ", response.body);
        }
        catch (ex) {
            response.logEnabled && console.log("Request url ", requestUrl, " Response is not a  JSON\nResponse Body ", response.body);
        }
    }
    if (response.logEnabled && typeof response.body === "string")
        console.log("Request url ", requestUrl, " Response body (non-json) ", response.body);

}

function convertObjectToFormData(body) {
    let formData = "";
    let bodyKeys = Object.keys(body);
    bodyKeys.forEach((key, index) => {
        let isLastItem = bodyKeys.length - 1 === index;
        formData += key;
        formData += "=";
        formData += body[key];
        if (!isLastItem) {
            formData += "&";
        }
    });
    return formData;
}

const getContentType = (headers = {}) => {
    let contentType = headers["Content-Type"];
    if (!contentType) {
        for (let h in headers) {
            if (h.toLowerCase() === "content-type") {
                contentType = headers[h];
                break;
            }
        }
    }
    return contentType;
};

module.exports = exports = ServiceCall;