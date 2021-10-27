/**
 * Smartface Service-Call helper module
 * @module service-call
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Alim Öncül <alim.oncul@smartface.io>
 * @copyright Smartface 2021
 */

import Http from "@smartface/native/net/http";
//@ts-ignore
import mixinDeep from "mixin-deep";
import copy from "../copy";
import queryString from "query-string";
import { createAsyncGetter } from "../async";

const reHTTPUrl = /^http(s?):\/\//i;
const reParseBodyAsText = /(?:application\/(?:x-csh|json|javascript|rtf|xml)|text\/.*|.*\/.*(:?\+xml|xml\+).*)/i;
const reJSON = /^application\/json/i;

const METHODS_WITHOUT_BODY = ["GET", "HEAD"];
const BASE_HEADERS = Object.freeze({
	"Content-Type": "application/json",
	Accept: "application/json",
	//@ts-ignore
	"Accept-Language": global.Device.language || "en",
	"Cache-Control": "no-cache",
});

const httpMap = new WeakMap();
const optionsMap = new WeakMap();

const getHttp = createAsyncGetter(() => new Http(), {});

interface IRequestOptions {
	/**
	 * HTTP method of this request
	 */
	method: string;
	/**
	 * Request payload body. This object will be automatically stringified
	 */
	body?: { [key: string]: any } | string;
	/**
	 * Query string string object. Combines with the url
	 */
	q?: string;
	/**
	 * Alias for options.q
	 */
	query?: string;
	/**
	 * Request specific headers. In conflict with configuration, those values are used
	 */
	headers?: { [key: string]: any } | string;
	/**
	 * Request specific log option
	 */
	logEnabled?: boolean;
	/**
	 * Basic authentication user. Must be used with options.password
	 */
	user?: string;
	/**
	 * Basic authentication password. Must be used with options.user
	 */
	password?: string;
	/**
	 * Resolved promise contains full response including `headers`, `body` and `status`
	 */
	fullResponse?: boolean;
	url?: string;
}

/**
 * Helper class for calling JSON based restful services.
 * @public
 */
export default class ServiceCall {
	/**
	 * Base URL for this service-call library uses. This can be get and set
	 * @property {string} baseUrl
	 */
	private _baseUrl = "";
	/**
	 * Log enabled for service-call. This can be get and set
	 * @property {boolean} logEnabled
	 */
	private _logEnabled = false;
	/**
	 * Creates a ServiceCall helper class with common configuration to be used across multiple service calls.
	 * @param {object} options - Cofiguration of service call helper object (required)
	 * @param {string} options.baseUrl - Base URL of all future service calls (required)
	 * @param {number} [options.timeout = 60000] - Timeout value for service calls. If not provided it uses the default timeout value from @smartface/native http
	 * @param {boolean} [options.logEnabled = false] - Logs the service requests & responses to console
	 * @param {object} [options.headers] - Sets the default headers for this configuration
	 * @example
	 *```
	 * // services/serviceConfig.ts
	 * import ServiceCall from '@smartface/extension-utils/lib/service-call"';
	 * export const sc = new ServiceCall({
	 *     baseUrl: "http://api.myBaseUrl.com",
	 *     logEnabled: true,
	 *     headers: {
	 *        apiVersion: "1.0"
	 *     }
	 * });
	 *
	 * // services/user.ts
	 * import { sc } from 'services/serviceConfig"';
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
	 * // pages/pgLogin.ts
	 * import userService from 'services/user';
	 *
	 * this.btnLogin.onPress = () => {
	 *      userService.login(this.tbUserName.text, this.tbPassword.text).then(()=> {
	 *         this.router.push("dashboard");
	 *      }).catch(()=> {
	 *          alert("Cannot login");
	 *      });
	 * };
	 * ```
	 */
	constructor(options: {
		baseUrl: string;
		timeout?: number;
		logEnabled?: boolean;
		headers?: { [key: string]: any } | string;
		sslPinning?: Http['ios']['sslPinning']
	}) {
		options = copy(options);
		options.baseUrl = options.baseUrl || "";
		const httpOptions: Partial<Http> = {};
		if (options.timeout) {
			//@ts-ignore
			httpOptions.timeout = options.timeout;
		}
		const http = new Http(httpOptions);
		httpMap.set(this, http);
		optionsMap.set(this, options);
	}

	/**
	 * Sets headers for this configuration. Either sets one by each call or sets them in bulk
	 * @method
	 * @param {string} key - Header name to set
	 * @param {string} value - Value to set of the key. If value is not a string, key is removed from header
	 * @example
	 * ```
	 * //After login
	 * sc.setHeader("Authorization", "Basic 12345");
	 * ```
	 * @example
	 * ```
	 * //After logout
	 * sc.setHeader("Authorization");
	 * ```
	 * @example
	 * ```
	 * // set multiple headers at once
	 * sc.setHeader({
	 *  environment: "test",
	 *  apiVersion: "1.2"  //replaces the existing
	 * });
	 * ```
	 */
	setHeader(key: string | Record<string, any>, value?: string): void {
		const serviceCallOptions = optionsMap.get(this);
		if (typeof key === "object") {
			for (let k in key) {
				let v = key[k];
				this.setHeader(k, v);
			}
		} else if (typeof key === "string") {
			if (value) {
				serviceCallOptions.headers[key] = String(value);
			} else {
				delete serviceCallOptions.headers[key];
			}
		} else {
			throw Error("key must be string or object");
		}
	}

	/**
	 * Gets a copy of headers used
	 * @method
	 * @returns {object} headers
	 */
	getHeaders(): Record<string, any> {
		const serviceCallOptions = copy(optionsMap.get(this));
		return serviceCallOptions.headers;
	}

	/**
	 * Base URL for this service-call library uses. This can be get and set
	 * @property {string} baseUrl
	 */
	get baseUrl(): string {
		const serviceCallOptions = copy(optionsMap.get(this));
		return serviceCallOptions.baseUrl;
	}

	set baseUrl(value: string) {
		const serviceCallOptions = copy(optionsMap.get(this));
		serviceCallOptions.baseUrl = value;
		optionsMap.set(this, serviceCallOptions);
	}

	/**
	 * Log enabled for service-call. This can be get and set
	 * @property {boolean} logEnabled
	 */
	get logEnabled(): boolean {
		const serviceCallOptions = copy(optionsMap.get(this));
		return serviceCallOptions.logEnabled;
	}

	set logEnabled(value: boolean) {
		const serviceCallOptions = copy(optionsMap.get(this));
		serviceCallOptions.logEnabled = value;
		optionsMap.set(this, serviceCallOptions);
	}

	/**
	 * creates a request options object for http request
	 * @method
	 * @example
	 * ```
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
	 * ```
	 */
	createRequestOptions(
		endpointPath: string,
		options: IRequestOptions
	): IRequestOptions {
		const serviceCallOptions = copy(optionsMap.get(this));
		if (!serviceCallOptions) {
			throw Error("This ServiceCall instnace is not configured");
		}
		const url = String(serviceCallOptions.baseUrl + endpointPath);
		if (!reHTTPUrl.test(url)) {
			throw Error(`URL is not valid for http(s) request: ${url}`);
		}
		const requestOptions = mixinDeep(
			{
				url,
				headers: serviceCallOptions.headers,
				logEnabled: !!serviceCallOptions.logEnabled,
				sslPinning: serviceCallOptions.sslPinning || undefined
			},
			options || {}
		);
		return requestOptions;
	}

	/**
	 * Combines serviceCall.createRequestOptions and ServiceCall.request
	 * @method
	 * @see ServiceCall.createRequestOptions
	 * @see ServiceCall.request
	 * @example
	 * ```
	 * function login(userName, password) {
	 *      return sc.request("/auth/login", {
	 *          method: "POST",
	 *          body: {
	 *              userName,
	 *              password
	 *          }
	 *      });
	 *  }
	 * ```
	 */
	request(endpointPath: string, options: IRequestOptions): Promise<any> {
		const requestOptions = this.createRequestOptions(endpointPath, options);
		console.info("instance request: ", requestOptions);
		return ServiceCall.request(requestOptions);
	}

	/**
	 * Performs a service call and returns a promise to handle
	 * @static
	 * @method
	 * @example
	 * ```
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
	 * ```
	 */
	static request(options: IRequestOptions): Promise<any> {
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
			console.info("options: ", options);
			let requestOptions = mixinDeep(
				{
					onLoad: (response: any) => {
						try {
							response.logEnabled = !!options.logEnabled;
							this.bodyParser(options.url || '', response);
							if (response.body && response.body.success === false)
								reject(fullResponse ? response : response.body);
							else resolve(fullResponse ? response : response.body);
						} catch (ex) {
							reject(ex);
						}
					},
					onError: (e: any) => {
						e.logEnabled = !!options.logEnabled;
						ServiceCall.bodyParser(options.url || '', e);
						e.requestUrl = options.url;
						reject(e);
					},
					headers: {},
				},
				options
			);
			console.info("requestOptions: ", requestOptions);
			if (METHODS_WITHOUT_BODY.indexOf(requestOptions.method) !== -1) {
				if (requestOptions.body) {
					delete requestOptions.body;
				}
				if (requestOptions.headers && requestOptions.headers["Content-Type"])
					delete requestOptions.headers["Content-Type"];
				options.logEnabled &&
					console.log("request: ", options.url, " ", requestOptions);
			} else {
				options.logEnabled &&
					console.log("request: ", options.url, " ", requestOptions);
				if (requestOptions.body && typeof requestOptions.body === "object") {
					if (
						requestOptions.headers["Content-Type"].startsWith(
							"application/json"
						)
					) {
						requestOptions.body = JSON.stringify(requestOptions.body);
					} else if (
						requestOptions.headers["Content-Type"].includes(
							"x-www-form-urlencoded"
						)
					) {
						requestOptions.body = ServiceCall.convertObjectToFormData(requestOptions.body);
					}
				}
			}
			getHttp()
				.then((http: any) => {
					const doesSSLExist = Array.isArray(requestOptions.sslPinning) && requestOptions.sslPinning.length > 0;
					requestOptions.timeout && (http.timeout = requestOptions.timeout);
					doesSSLExist && (http.ios.sslPinning = requestOptions.sslPinning);

					console.info({
						doesSSLExist,
						requestPinning: requestOptions.sslPinning,
						httpPinning: http.ios.sslPinning
					})
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
  static readonly BASE_HEADERS = BASE_HEADERS;

	static bodyParser(requestUrl: string, response: any) {
		const contentType =
			(response.headers && ServiceCall.getContentType(response.headers)) || "";
		reJSON.lastIndex = reParseBodyAsText.lastIndex = 0;
		if (reParseBodyAsText.test(contentType))
			response.body = response.body.toString();
		response.body = response.body || "{}";

		if (reJSON.test(contentType)) {
			try {
				response.body = JSON.parse(response.body);
				response.logEnabled &&
					console.log(
						"Request url ",
						requestUrl,
						" Response body ",
						response.body
					);
			} catch (ex) {
				response.logEnabled &&
					console.log(
						"Request url ",
						requestUrl,
						" Response is not a  JSON\nResponse Body ",
						response.body
					);
			}
		}
		if (response.logEnabled && typeof response.body === "string")
			console.log(
				"Request url ",
				requestUrl,
				" Response body (non-json) ",
				response.body
			);
	}

	static convertObjectToFormData(body: any) {
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

	static getContentType(headers: Record<string, any> = {}) {
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
	}
}
