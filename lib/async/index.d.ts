/**
 * Button & ActivityIndicator helper module
 * @module async
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

/**
 * Returns a getter function, which returns the promise of the asyc task.
 * @public
 * @method
 * @param {function} task - is called as AsyncTask. Make sure that no UI operation takes place. Return value of the task function is used as the resolved argument
 * @param {object} [options = {}] - Options object
 * @param {boolean} [options.forceSynch = false] - Calls the function direclty without async task
 * @param {object} [options.thisObject = global] - `this` keyword for the function to be callled
 * @returns {getter} a function which returns promise
 * @example
 * import { createAsyncGetter } from '@smartface/extension-utils/lib/async';
 * import System = require('@smartface/native/device/system');
 * 
 * 
 * getLibphonenumber = createAsyncGetter(() => {
 *     let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
 *     let PNT = require('google-libphonenumber').PhoneNumberType;
 *     let PNF = require('google-libphonenumber').PhoneNumberFormat;
 *     return {
 *         phoneUtil,
 *         PNT,
 *         PNF
 *     };
 * }, {
 *     forceSynch: System.OS === "iOS"
 * });
 * 
 * //using the promise function
 * tbPhone.onTextChanged = function(e) {
 *     getLibphonenumber().then(({ phoneUtil, PNT }) => {
 *         var phoneNumber = phoneUtil.parse(tbPhone.text, phoneUtilCountryCode);
 *         var isValid = phoneUtil.isValidNumber(phoneNumber) &&
 *             phoneUtil.getNumberType(phoneNumber) === PNT.MOBILE;
 *     });
 * };
 */
export function createAsyncGetter(task: () => {}, options: { forceSync?: boolean, thisObject?: { [key: string]: any } | string } ): () => Promise<any>;

/**
 * Runs the async task and responds a promise
 * @public
 * @method
 * @param {function} task - is called as AsyncTask. Make sure that no UI operation takes place. Return value of the task function is used as the resolved argument
 * @param {object} [options = {}] - Options object
 * @param {boolean} [options.forceSynch = false] - Calls the function direclty without async task
 * @param {object} [options.thisObject = global] - `this` keyword for the function to be callled
 * @returns {Promise} when resolved return value of the task is provided
 * @example
 * import { createAsyncTask } from '@smartface/extension-utils/lib/async';
 * import Http = require("@smartface/native/net/http");
 * createAsyncTask(()=> new Http()).then(http => http.request(requestOptions));
 */
export function createAsyncTask(task: () => {}, options: { forceSync?: boolean, thisObject?: { [key: string]: any } | string } ): Promise<any>
