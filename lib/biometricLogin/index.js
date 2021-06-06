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

const semver = require("semver");
const System = require('@smartface/native/device/system');
const privates = new WeakMap();
const Data = require('@smartface/native/data');
const AlertView = require('@smartface/native/ui/alertview');
const SecureData = require("@smartface/native/global/securedata");
const Application = require("@smartface/native/application");
const langChecker = require("../base/langchecker")("language");
langChecker.check(["fingerprintUpdateStoredCredentialsTitle",
    "fingerprintUpdateStoredCredentialsMessage", "yes", "no",
    "useFingerprintTitle", "useFingerprintMessage", "scanFingerprintTitle",
    "scanFingerprintMessage"
]);

const MINUMUM_SUPPORTED_VERSION_OF_BIOMETRIC_SECURITY_FOR_IOS = "12.0.0";
const FACEID_ENABLED = faceIDEnabled();
const LOGIN_METHOD = (FACEID_ENABLED ? "FaceID" : "Fingerprint");
const useTitle = (FACEID_ENABLED ? global.lang.useFaceIDTitle : global.lang.useFingerprintTitle);
const useMessage = (FACEID_ENABLED ? global.lang.useFaceIDMessage : global.lang.useFingerprintMessage);
const scanTitle = (FACEID_ENABLED ? global.lang.scanFaceIDTitle : global.lang.scanFingerprintTitle);
const scanMessage = (FACEID_ENABLED ? global.lang.scanFaceIDMessage : global.lang.scanFingerprintMessage);

/**
 * Fields that use Data variables to store contents, consider those as reserved keys.
 * The module uses Data on smartface, so calling [removeAllVariables](http://ref.smartface.io/#!/api/Data-method-removeAllVariables) will break the save functionalities.
 * Data will be written encrypted.
 * 
 * @typedef FIELDS
 * @type {Object}
 * @static
 * @readonly
 * @property {string} USERNAME=username
 * @property {string} PASSWORD=password
 * @property {string} REMEMBER_ME=rememberMe
 * @property {string} USE_FINGERPRINT=useFingerprint
 */
const FIELDS = Object.freeze({
    USERNAME: "username",
    PASSWORD: "password",
    REMEMBER_ME: "rememberMe",
    USE_FINGERPRINT: "useFingerprint"
});

/**
 * [SecureData](http://ref.smartface.io/#!/api/SecureData) istances for encrypted fields
 * @type {Object}
 * @private
 * @property {SecureData} userName
 * @property {SecureData} password
 */
const secureData = {
    username: new SecureData({
        ios: {
            service: Application.ios.bundleIdentifier
        },
        key: FIELDS.USERNAME
    }),
    password: new SecureData({
        ios: {
            service: Application.ios.bundleIdentifier
        },
        key: FIELDS.PASSWORD
    })
};

/**
 * @class
 * @example
 * import BiometricLogin from "sf-extension-utils/lib/biometricLogin";
 * function onLoad(superOnLoad) {
 *     superOnLoad();
 *     const { mtbEmail, mtbPassword, btnLogin } = this;
 *     const biometricLogin = new BiometricLogin({
 *         loginService: () => login(mtbEmail.materialTextBox.text, mtbPassword.materialTextBox.text),
 *         getField: getField.bind(this),
 *         setField: setField.bind(this)
 *     });
 *     page.biometricLogin = biometricLogin;
 *     btnLogin.onPress = btnLogin_onPress.bind(this);
 * }
 * function onShow(superOnShow) {
 *     this.biometricLogin && this.biometricLogin.load({
 *         doNotAutoAskLogin: false
 *     });
 * }
 *
 * function btnLogin_onPress() {
 *     this.biometricLogin.loginWithBiometric();
 * }
 *
 * function setField(fieldName, value) {
 *     const { mtbEmail, mtbPassword, switchRememberMe, switchFingerPrint } = this;
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
 * function getField(fieldName) {
 *     const { mtbEmail, mtbPassword, switchRememberMe, switchFingerPrint } = this;
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
 * function login(username, password) {
 *     return new Promise((resolve, reject) => {
 *         setTimeout(() => resolve({ token: "exampleToken" }), 1000);
 *     })
 * }
*/
class BiometricLogin {
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
    constructor({
        doNotAskOnFirstTime = false,
        getField,
        setField,
        loginService,
        dataPrefix = "fp",
        serviceName = Application.ios.bundleIdentifier,
        confirmUseBiometricOnFirstLogin = true,
        loginHandler = Promise.resolve()
    }) {
        let p = {
            doNotAskOnFirstTime,
            getField,
            setField,
            loginService,
            dataPrefix,
            serviceName,
            confirmUseBiometricOnFirstLogin,
            loginHandler
        };
        privates.set(this, p);
    }

    /**
     * @static
     * @type {FIELDS}
     * @name BiometricLogin.FIELDS
     * 
     */
    static get FIELDS() {
        return FIELDS;
    }

    /**
     * Fetchs given encrypted boolean field name. Advanced use only.
     * @function getBooleanData
     * @param {string} field 
     * @returns {boolean}
     */
    getBooleanData(field) {
        let { dataPrefix } = privates.get(this);
        let value = Data.getBooleanVariable(`${dataPrefix}-${field}`) || false;
        return value;
    }

    /**
     * Writes given boolean value to the device storage encrypted. Advanced use only.
     * @function setBooleanData
     * @param {string} field 
     * @param {boolean} value
     */
    setBooleanData(field, value) {
        let { dataPrefix } = privates.get(this);
        value = value || false;
        Data.setBooleanVariable(`${dataPrefix}-${field}`, value);
        return value;
    }

    /**
     * Returns relevant SecureData value. Advanced use only.
     * @function getSecureData
     * @param {string} field 
     * @returns {SecureData}
     */
    getSecureData(field) {
        // let { serviceName } = privates.get(this);
        return secureData[field];
    }

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
     *  function onShow(superOnShow) {
     *     const page = this;
     *     page.biometricLogin && page.biometricLogin.load({
     *         doNotAutoAskLogin: false
     *     });
     *  }
     */
    load({
        doNotAutoAskLogin = false,
        rememberMeDisabledForTheFirstTime = false,
        useFingerprintDisabledForTheFirstTime = false
    } = {}) {
        return this.getSecureData(FIELDS.USERNAME).read()
            .catch(e => {
                return Promise.resolve("");
            })
            .then(username => {
                let rememberMe = this.getBooleanData(FIELDS.REMEMBER_ME);
                let useFingerprint = System.fingerPrintAvailable && this.getBooleanData(FIELDS.USE_FINGERPRINT);
                if (!this.isFirstTime) {
                    rememberMe && this.updateField(FIELDS.USERNAME, username);
                    rememberMe && this.updateField(FIELDS.PASSWORD, "");
                    this.updateField(FIELDS.REMEMBER_ME, rememberMe);
                    this.updateField(FIELDS.USE_FINGERPRINT, useFingerprint);
                }
                else {
                    this.updateField(FIELDS.REMEMBER_ME, !rememberMeDisabledForTheFirstTime);
                    this.updateField(FIELDS.USE_FINGERPRINT, !useFingerprintDisabledForTheFirstTime);
                    this.setBooleanData(FIELDS.REMEMBER_ME, !rememberMeDisabledForTheFirstTime);
                    this.setBooleanData(FIELDS.USE_FINGERPRINT, !useFingerprintDisabledForTheFirstTime);
                }
                if (username && rememberMe && useFingerprint && !this.isFirstTime && !doNotAutoAskLogin) {
                    this.loginWithBiometric();
                }
            });
    }

    /**
     * Will prompt user to input their biometric information. Advanced use only.
     * This function is used internally, you do not need to call this on common cases.
     * @function validateBiometric
     * @static
     * @returns {Promise}
     */
    static validateBiometric() {
        return new Promise((resolve, reject) => {
            if (System.fingerPrintAvailable)
                System.validateFingerPrint({
                    android: {
                        title: scanTitle || `Login with ${LOGIN_METHOD} `
                    },
                    message: scanMessage || `Scan your ${LOGIN_METHOD} `,
                    onSuccess: () => { resolve(true) },
                    onError: err => { reject(err) }
                });
            else
                reject("Biometric is not supported");
        });
    }

    /**
     * Tries to call 'loginService' Promise given on the constructor.
     * Use this function on your login button press
     * @function loginWithBiometric
     * @returns {Promise}
     * @example
     * function onLoad() {
     *     const page = this;
     *     const { btnLogin } = page;
     *     btnLogin.onPress = btnLogin_onPress.bind(page);
     * }
     * function btnLogin_onPress() {
     *     const page = this;
     *     page.biometricLogin.loginWithBiometric();
     * }
     */
    loginWithBiometric() {
        let { loginService, confirmUseBiometricOnFirstLogin, loginHandler } = privates.get(this);
        let userNameUserEntry = this.retrieveField(FIELDS.USERNAME);
        let userNameStored = "";
        let passwordUserEntry = this.retrieveField(FIELDS.PASSWORD);
        let passwordStored = "";
        let userNameToUse = "";
        let passwordToUse = "";
        let rememberMe = this.retrieveField(FIELDS.REMEMBER_ME);

        let useFingerprint = this.retrieveField(FIELDS.USE_FINGERPRINT); // Disabling it won't remove credentials
        let canUseFingerprint = System.fingerPrintAvailable && useFingerprint;

        let userNameSec = this.getSecureData(FIELDS.USERNAME);
        let passwordSec = this.getSecureData(FIELDS.PASSWORD);

        return Promise.all([
                userNameSec.read().catch((e) => Promise.resolve("")),
                passwordSec.read().catch((e) => Promise.resolve(""))
            ])
            .then(([storedUserName, storedPassword]) => {
                userNameStored = storedUserName;
                passwordStored = storedPassword;
                return Promise.resolve();
            })
            .then(() => {
                if (canUseFingerprint) {
                    if (this.isFirstTime) {
                        if (confirmUseBiometricOnFirstLogin) {
                            return firstTimeConfirmation()
                                .then(() => {
                                    this.setBooleanData(FIELDS.USE_FINGERPRINT, true);
                                    this.updateField(FIELDS.USE_FINGERPRINT, true);
                                })
                                .then(() => Promise.resolve(passwordUserEntry))
                                .catch((e) => {
                                    this.setBooleanData(FIELDS.USE_FINGERPRINT, false);
                                    this.updateField(FIELDS.USE_FINGERPRINT, false);
                                    return Promise.resolve(passwordUserEntry);
                                });
                        }
                        else {
                            return Promise.resolve(passwordUserEntry);
                        }
                    }
                    else {
                        if (userNameUserEntry === userNameStored && !passwordUserEntry) {
                            return BiometricLogin.validateBiometric()
                                .then(() => Promise.resolve(passwordStored))
                                .catch(() => Promise.reject("Biometric was not validated"));
                        }
                        else {
                            return BiometricLogin.validateBiometric()
                                .then(() => Promise.resolve(passwordUserEntry))
                                .catch(() => Promise.reject("Biometric was not validated"));
                        }
                    }
                }
                else {
                    return Promise.resolve(passwordUserEntry);
                }

            })
            .then(passwordToLogin => {
                userNameToUse = userNameUserEntry;
                passwordToUse = passwordToLogin;
                return loginService(userNameUserEntry, passwordToUse);
            })
            .then(loginResponse => {
                this.setBooleanData("firstTimePassed", true);
                this.setBooleanData(FIELDS.REMEMBER_ME, rememberMe);
                this.setBooleanData(FIELDS.USE_FINGERPRINT, useFingerprint);

                if (canUseFingerprint) {
                    let isUserNameDifferent = userNameStored !== userNameToUse;
                    let isPasswordDifferent = passwordStored !== passwordToUse;
                    if (!this.isFirstTime && (isUserNameDifferent || isPasswordDifferent)) {
                        return updateCredentailsConfirmation()
                            .then(() => Promise.resolve({ loginResponse, updateCredentials: true }))
                            .catch(() => Promise.resolve({ loginResponse, updateCredentials: false }));
                    }
                }
                return Promise.resolve({ loginResponse, updateCredentials: true });
            })
            .then(loginResult => {
                let { loginResponse, updateCredentials } = loginResult;
                if (updateCredentials && canUseFingerprint) {
                    userNameSec.save({ value: userNameToUse });
                    passwordSec.save({ value: passwordToUse });
                }
                else if (rememberMe) {
                    userNameSec.save({ value: userNameUserEntry });
                }
                try {
                    let loginHandlerResult = loginHandler(loginResponse) || loginResponse;
                    let isHandlerPromise = loginHandlerResult instanceof Promise;
                    return isHandlerPromise ? loginHandlerResult : Promise.resolve(loginHandlerResult);
                }
                catch (ex) {
                    return Promise.reject(ex);
                }
            }).then(loginHandlerResult => {
                /* Post login processes after user is redirected goes here */
                return Promise.resolve(loginHandlerResult);
            });
    }

    /**
     * Returns given field. Advanced use only.
     * @function retrieveField
     * @param {string} fieldName
     * @returns {string}
     */
    retrieveField(fieldName) {
        let { getField } = privates.get(this);
        let defaultValue = false;
        if ([FIELDS.PASSWORD, FIELDS.USERNAME].includes(fieldName))
            defaultValue = "";
        return getField(fieldName) || defaultValue;
    }

    /**
     * Updates given field value. Advanced use only.
     * @function updateField
     * @param {string} fieldName
     * @param {string} value
     */
    updateField(fieldName, value) {
        let { setField } = privates.get(this);
        return setField(fieldName, value);
    }

    /**
     * Returns true if the device is not logged in with biometrics before.
     * @function isFirstTime
     * @returns {boolean}
     */
    get isFirstTime() {
        let field = "firstTimePassed";
        let value = !this.getBooleanData(field);
        return value;
    }
}

/**
 * Gets if the device has faceID. Android is not currently supported.
 * @function faceIDEnabled
 * @private
 * @returns {boolean}
 */
function faceIDEnabled() {
    if (System.OS === "Android")
        return false; // Some Android devices support faceID

    // Fix version to support semver
    var versionRegex = /(\d+)\.(\d+)(?:\.(\d+))?/;
    var [, major = 0, minor = 0, patch = 0] = versionRegex.exec(System.OSVersion);
    var osVersion = `${major}.${minor}.${patch}`;

    if (semver.satisfies(MINUMUM_SUPPORTED_VERSION_OF_BIOMETRIC_SECURITY_FOR_IOS, `<=${osVersion}`)) {
        return System.ios.LAContextBiometricType === System.ios.LABiometryType.FACEID;
    }
    return false;
}

/**
 * Prompts first time biometric alert together with permissions.
 * Promise is rejected if prompt alert is declined
 * @function firstTimeConfirmation
 * @private
 * @returns {Promise}
 */
const firstTimeConfirmation = () => {
    let confirmUseBiometric = new Promise((resolve, reject) => {
        alert({
            title: useTitle || `Use ${LOGIN_METHOD} `,
            message: useMessage || `Would you like to use ${LOGIN_METHOD} login on your future logins?`,
            buttons: [{
                text: global.lang.yes || "Yes",
                type: AlertView.Android.ButtonType.POSITIVE,
                onClick: function() {
                    resolve();
                },
            }, {
                text: global.lang.no || "No",
                type: AlertView.Android.ButtonType.NEGATIVE,
                onClick: function() {
                    reject(`User does not want to use ${LOGIN_METHOD} `);
                },
            }]
        });
    });
    return confirmUseBiometric
        .then(() => BiometricLogin.validateBiometric());

};

/**
 * Prompts 'Would you like to update your stored credentials' alert
 * Promise is rejected if prompt alert is declined
 * @function updateCredentailsConfirmation
 * @private
 * @returns {Promise}
 */
const updateCredentailsConfirmation = () => {
    return new Promise((resolve, reject) => {
        alert({
            title: global.lang.fingerprintUpdateStoredCredentialsTitle || "Update stored credentials",
            message: global.lang.fingerprintUpdateStoredCredentialsMessage || "Would you like to update your stored username and password with newly entered username and password",
            buttons: [{
                text: global.lang.yes || "Yes",
                type: AlertView.Android.ButtonType.POSITIVE,
                onClick: function() {
                    resolve();
                },
            }, {
                text: global.lang.no || "No",
                type: AlertView.Android.ButtonType.NEGATIVE,
                onClick: function() {
                    reject();
                },
            }]
        });
    });
};

exports = module.exports = BiometricLogin;
