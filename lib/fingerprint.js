/**
 * Smartface Fingerprint for login module
 * @module fingerprint
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Furkan Arabaci <furkan.arabaci@smartface.io>
 * @copyright Smartface 2019
 */

const semver = require("semver");
const System = require('sf-core/device/system');
const privates = new WeakMap();
const Data = require('sf-core/data');
const AlertView = require('sf-core/ui/alertview');
const SecureData = require("sf-core/global/securedata");
const Application = require("sf-core/application");
const langChecker = require("./base/langchecker")("language");
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

const USERNAME_KEY = "username";
const PASSWORD_KEY = "password";
const FIELDS = Object.freeze({
    USERNAME: "username",
    PASSWORD: "password",
    REMEMBER_ME: "rememberMe",
    USE_FINGERPRINT: "useFingerprint"
});

const secureData = {
    username: new SecureData({
        ios: {
            service: Application.ios.bundleIdentifier
        },
        key: USERNAME_KEY
    }),
    password: new SecureData({
        ios: {
            service: Application.ios.bundleIdentifier
        },
        key: PASSWORD_KEY
    })
};

class Fingerprint {
    constructor({
        doNotAskOnFirstTime = false,
        getField,
        setField,
        loginService,
        dataPrefix = "fp",
        serviceName = Application.ios.bundleIdentifier,
        confirmUseFingerprintOnFirstLogin,
        loginHandler = Promise.resolve(),
        autoLogin = true
    }) {
        let p = {
            doNotAskOnFirstTime,
            getField,
            setField,
            loginService,
            dataPrefix,
            serviceName,
            confirmUseFingerprintOnFirstLogin,
            loginHandler,
            autoLogin
        };
        privates.set(this, p);
    }

    static get FIELDS() {
        return FIELDS;
    }

    getBooleanData(field) {
        let { dataPrefix } = privates.get(this);
        let value = Data.getBooleanVariable(`${dataPrefix}-${field}`) || false;
        return value;
    }

    setBooleanData(field, value) {
        let { dataPrefix } = privates.get(this);
        value = value || false;
        Data.setBooleanVariable(`${dataPrefix}-${field}`, value);
        return value;
    }

    getSecureData(field) {
        // let { serviceName } = privates.get(this);
        return secureData[field];
    }

    load({
        doNotAutoAskLogin = false,
        rememberMeDisabledForTheFirstTime = false,
        useFingerprintDisabledForTheFirstTime = false
    } = {}) {
        console.log("about to read username");
        return this.getSecureData(FIELDS.USERNAME).read()
            .catch(e => {
                console.log("Could not read username : ", e);
                return Promise.resolve("");
            })
            .then(username => {
                console.log("username is : ", username);
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
                if (username && rememberMe && useFingerprint && !this.isFirstTime && !doNotAutoAskLogin && this.autoLogin) {
                    this.loginWithFingerprint();
                }
            });
    }

    static validateFingerPrint() {
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
                reject("FINGERPRINT NOT SUPPORTED");
        });
    }

    loginWithFingerprint() {
        let { loginService, confirmUseFingerprintOnFirstLogin, loginHandler } = privates.get(this);
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

        console.log("start");
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
                    console.log("can use Fingerprint");
                    if (this.isFirstTime) {
                        console.log("it is first time");
                        if (confirmUseFingerprintOnFirstLogin) {
                            console.log("is about to confirm first login");
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
                            console.log("not going to confirm on first login");
                            return Promise.resolve(passwordUserEntry);
                        }
                    }
                    else {
                        console.log("it is not the fist time");
                        console.log("username and password stores values : ", {
                            userNameUserEntry,
                            userNameStored,
                            passwordUserEntry,
                            "userNameUserEntry === userNameStored": userNameStored === userNameStored,
                            "userNameUserEntry === userNameStored && !passwordUserEntry": userNameStored === userNameStored && !passwordUserEntry
                        });
                        if (userNameUserEntry === userNameStored && !passwordUserEntry) {
                            console.log("about to validate fingerprint on stored values");
                            return Fingerprint.validateFingerPrint()
                                .then(() => Promise.resolve(passwordStored))
                                .catch(() => Promise.reject("Fingerprint was not validated"));
                        }
                        else {
                            console.log("password entered manually or logged in before by disabling face id/touch id");
                            return Fingerprint.validateFingerPrint()
                                .then(() => Promise.resolve(passwordUserEntry))
                                .catch(() => Promise.reject("Fingerprint was not validated"));
                        }
                    }
                }
                else {
                    console.log("fingerprint not available");
                    return Promise.resolve(passwordUserEntry);
                }

            })
            .then(passwordToLogin => {
                console.log("about to call login service : ", {
                    passwordToLogin,
                    passwordStored,
                    passwordUserEntry
                });
                userNameToUse = userNameUserEntry;
                passwordToUse = passwordToLogin;
                return loginService(userNameUserEntry, passwordToUse);
            })
            .then(loginResponse => {
                console.log("logged in successfully");
                this.setBooleanData("firstTimePassed", true);
                this.setBooleanData(FIELDS.REMEMBER_ME, rememberMe);
                this.setBooleanData(FIELDS.USE_FINGERPRINT, useFingerprint);

                if (canUseFingerprint) {
                    let isUserNameDifferent = userNameStored !== userNameToUse;
                    let isPasswordDifferent = passwordStored !== passwordToUse;
                    console.log("about to ask for update if credentials are different : ", {
                        isUserNameDifferent,
                        isPasswordDifferent
                    });
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
                    console.log("User chose to update, saving username and password : ", {
                        username: userNameUserEntry || userNameStored,
                        password: passwordUserEntry || passwordStored
                    });
                    userNameSec.save({ value: userNameToUse });
                    passwordSec.save({ value: passwordToUse });
                }
                else if (rememberMe) {
                    console.log("saving username due to remember me");
                    userNameSec.save({ value: userNameUserEntry });
                }
                else {
                    console.log("User did not choose to save or did not use fingerprint");
                }
                try {
                    let loginHandlerResult = loginHandler(loginResponse) || loginResponse;
                    let isHandlerPromise = loginHandlerResult instanceof Promise;
                    console.log("Login handled successfully");
                    return isHandlerPromise ? loginHandlerResult : Promise.resolve(loginHandlerResult);
                }
                catch (ex) {
                    console.log("Is logged in, but handler went wrong");
                    return Promise.reject(ex);
                }
            }).then(loginHandlerResult => {
                /* Post login processes after user is redirected goes here */
                return Promise.resolve(loginHandlerResult);
            })
            .catch(err => {
                console.log("Something went wrong during fingerprint login. Details : ", err);
            });
    }

    retrieveField(fieldName) {
        let { getField } = privates.get(this);
        let defaultValue = false;
        if ([FIELDS.PASSWORD, FIELDS.USERNAME].includes(fieldName))
            defaultValue = "";
        return getField(fieldName) || defaultValue;
    }

    updateField(fieldName, value) {
        let { setField } = privates.get(this);
        return setField(fieldName, value);
    }

    get isFirstTime() {
        let field = "firstTimePassed";
        let value = !this.getBooleanData(field);
        return value;
    }
}

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

const firstTimeConfirmation = () => {
    let confirmUseFingerprint = new Promise((resolve, reject) => {
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
    return confirmUseFingerprint
        .then(() => Fingerprint.validateFingerPrint());

};

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

exports = module.exports = Fingerprint;
