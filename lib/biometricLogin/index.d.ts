/**
 * Smartface biometric login module.
 * Provides an extendible class to handle most common biometric login quirks.
 * The account username-password will be encrypted on the device storage.
 * @module BiometricLogin
 * @type {Class}
 * @author Alper Ozışık <alper.ozisik@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2019
 */

import SecureData = require("sf-core/global/securedata");

declare interface IBiometricLoginParams {
    doNotAskOnFirstTime?: boolean;
    getField: (fieldName: string) => string;
    setField: (fieldName: string, value: string ) => void;
    loginService: () => Promise<any>;
    dataPrefix?: string;
    serviceName?: string;
    confirmUseBiometricOnFirstLogin?: boolean;
    loginHandler?: () => Promise<any>;
}

/**
 * @class 
 * @example
 * import BiometricLogin from 'sf-extension-utils/lib/biometricLogin';
 * onLoad(superOnLoad) {
 *     superOnLoad();
 *     const {mtbEmail, mtbPassword, btnLogin} = this;
 *     this.biometricLogin = new BiometricLogin({
 *         loginService: () => login(mtbEmail.materialTextBox.text, mtbPassword.materialTextBox.text),
 *         getField: getField(this),
 *         setField: setField(this)
 *     });
 *     btnLogin.onPress = () => btnLogin_onPress();
 * }
 * onShow(superOnShow) {
 *     this.biometricLogin.load({
 *         doNotAutoAskLogin: false
 *     });
 * }
 *
 * btnLogin_onPress() {
 *     this.biometricLogin.loginWithBiometric();
 * }
 * 
 * setField(fieldName, value) {
 *     const {mtbEmail, mtbPassword, switchRememberMe, switchFingerPrint} = this;
 *     switch (fieldName) {
 *         case BiometricLogin.FIELDS.USERNAME:
 *             return mtbEmail.materialTextBox.text = value;
 *         case BiometricLogin.FIELDS.PASSWORD:
 *             return mtbPassword.materialTextBox.text = value;
 *         case BiometricLogin.FIELDS.REMEMBER_ME:
 *             return switchRememberMe.toggle = true;
 *         case BiometricLogin.FIELDS.USE_FINGERPRINT:
 *             return switchFingerPrint.toggle = value;
 *         default:
 *             console.error("Invalid FIELDS");
 *             break;
 *     }
 * }
 * 
 * getField(fieldName) {
 *     const {mtbEmail, mtbPassword, switchRememberMe, switchFingerPrint} = this;
 *     switch (fieldName) {
 *         case BiometricLogin.FIELDS.USERNAME:
 *             return mtbEmail.materialTextBox.text;
 *         case BiometricLogin.FIELDS.PASSWORD:
 *             return mtbPassword.materialTextBox.text;
 *         case BiometricLogin.FIELDS.REMEMBER_ME:
 *             return switchRememberMe.toggle;
 *         case BiometricLogin.FIELDS.USE_FINGERPRINT:
 *             return switchFingerPrint.toggle;
 *         default:
 *             console.error("Invalid FIELDS");
 *             break;
 *     }
 * }
 * 
 * function login(username, password): Promise<any> {
 *     return setTimeout(() => Promise.resolve({ token: "exampleToken" }), 1000);
 * }
*/
export default class {
    /**
     * @param {object} options - Parameters to construct biometrics from
     * @param {boolean} options.doNotAskOnFirstTime=false - Toggles the first time prompt
     * @param {function(string):string} options.getField - Gets the stored field ( required )
     * @param {function(string,string):void} options.setField - Sets the stored field ( required )
     * @param {function():Promise} options.loginService - Service call to request on login ( required )
     * @param {string} options.dataPrefix=fp - Prefix to use on data store. E.g default on data will be fp-userName
     * @param {string} options.serviceName=Application.iOS.bundleIdentifier - iOS only, defaults to bundleIdentifier.
     * @param {boolean} options.confirmUseBiometricOnFirstLogin=true - Specifies if biometric data is going to be prompted on first login
     * @param {function(object):Promise} options.loginHandler - Post login actions, should return promise
     */
    constructor(options: IBiometricLoginParams); 

    /**
     * @static
     * @type {FIELDS}
     * @name BiometricLogin.FIELDS
     * 
     */
    static get FIELDS(): { [key: string]: any };

    /**
     * Fetchs given encrypted boolean field name. Advanced use only.
     * @function getBooleanData
     * @param {string} field 
     * @returns {boolean}
     */
    getBooleanData(field: string): boolean;

    /**
     * Writes given boolean value to the device storage encrypted. Advanced use only.
     * @function setBooleanData
     * @param {string} field 
     * @param {boolean} value
     */
    setBooleanData(field: string, value: boolean): void;

    /**
     * Returns relevant SecureData value. Advanced use only.
     * @function getSecureData
     * @param {string} field 
     * @returns {SecureData}
     */
    getSecureData(field: string): SecureData;

    /**
     * Main functionality of the module. Call this function at onShow method of the page for auto login handling. 
     * Note that your page will be prompted to validate biometric information when it is loaded.
     * To overcome it, use doNotAutoAskLogin property
     * @function load
     * @param {Object} loadParams
     * @param {boolean} loadParams.doNotAutoAskLogin=false - Toggles autologin on this function call
     * @param {boolean} loadParams.rememberMeDisabledForTheFirstTime=false - Toggles disabling remember me functionality on first time
     * @param {boolean} loadParams.useFingerprintDisabledForTheFirstTime=false - Will be logged in normally if set to false
     * @returns {Promise} - Always resolves the promise, so don't bother chaining it.
     * @example
     *  onShow(superOnShow) {
     *     this.biometricLogin.load({
     *         doNotAutoAskLogin: false
     *     });
     *  }
     */
    load(options: { 
        doNotAutoAskLogin: boolean;
        rememberMeDisabledForTheFirstTime: boolean;
        useFingerprintDisabledForTheFirstTime: boolean;
    }) : Promise<any>;

    /**
     * Will prompt user to input their biometric information. Advanced use only.
     * This function is used internally, you do not need to call this on common cases.
     * @function validateBiometric
     * @static
     * @returns {Promise}
     */
    static validateBiometric(): Promise<any>

    /**
     * Tries to call 'loginService' Promise given on the constructor.
     * Use this function on your login button press
     * @function loginWithBiometric
     * @returns {Promise}
     * @example
     * onLoad() {
     *     this.btnLogin.onPress = btnLogin_onPress.bind(page);
     * }
     * btnLogin_onPress() {
     *     this.biometricLogin.loginWithBiometric();
     * }
     */
    loginWithBiometric(): Promise<any>;

    /**
     * Returns given field. Advanced use only.
     * @function retrieveField
     * @param {string} fieldName
     * @returns {string}
     */
    retrieveField(fieldName: string): string;

    /**
     * Updates given field value. Advanced use only.
     * @function updateField
     * @param {string} fieldName
     * @param {string} value
     */
    updateField(fieldName: string, value: string);

    /**
     * Returns true if the device is not logged in with biometrics before.
     * @function isFirstTime
     * @returns {boolean}
     */
    get isFirstTime(): boolean;
}