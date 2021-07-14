/**
 * Button & ActivityIndicator helper module
 * @module async
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

const AsyncTask = require("@smartface/native/asynctask");

Object.assign(exports, {
    createAsyncGetter,
    createAsyncTask
});

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
 * import { createAsyncGetter } from "@smartface/extension-utils/lib/async";
 * import { OS } from '@smartface/native/device/system';
 * 
 * 
 * getLibphonenumber = createAsyncGetter(() => {
 *     const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
 *     const PNT = require('google-libphonenumber').PhoneNumberType;
 *     const PNF = require('google-libphonenumber').PhoneNumberFormat;
 *     return {
 *         phoneUtil,
 *         PNT,
 *         PNF
 *     };
 * }, {
 *     forceSynch: OS === "iOS"
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
function createAsyncGetter(task, options = {}) {
    const { forceSynch = false, thisObject = global } = options;
    var cache,
        waitList = [],
        err;

    if (!forceSynch) {
        let asynctask = new AsyncTask({
            task: function() {
                try {
                    cache = task.call(thisObject);
                }
                catch (ex) {
                    err = ex;
                }
            },
            onComplete: function() {
                waitList.forEach(waiting => waiting());
                waitList.length = 0;
                waitList = null;
            }
        });
        asynctask.run();
    }
    else {
        cache = task.call(thisObject);
    }
    /**
     * Getter function for createAsyncGetter. Calling the getter will not trigger the async task to run. Puts the requests in que and responds when the task is done. If the task is already resolved, automatically resolves the promise. Any exceptions for the task causes rejection.
     * @internal
     * @method getter
     * @returns {Promise} Promise is resolved when the task is finished
     */
    return function getter() {
        return new Promise((resolve, reject) => {
            if (cache) {
                err ? reject(err) : resolve(cache);
            }
            else {
                waitList.push(() => {
                    err ? reject(err) : resolve(cache);
                });
            }
        });
    };
}

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
 * import { createAsyncTask } from "@smartface/extension-utils/lib/async";
 * import Http from "@smartface/native/net/http";
 * createAsyncTask(()=> new Http()).then(http => http.request(requestOptions));
 */
function createAsyncTask(task, options = {}) {
    const { forceSynch = false, thisObject = global } = options;
    return new Promise((resolve, reject) => {
        if (!forceSynch) {
            let result;
            let err;
            let asynctask = new AsyncTask({
                task: function() {
                    try {
                        result = task.call(thisObject);
                    }
                    catch (ex) {
                        err = ex;
                    }
                },
                onComplete: function() {
                    err ? reject(err) : resolve(result);
                }
            });
            asynctask.run();
        }
        else {
            resolve(task.call(thisObject));
        }
    });
}
