/**
 * Smartface Fingerprint for login module
 * @module fingerprint
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2019
 */


const System = require('sf-core/device/system');
const privates = new WeakMap();
const Data = require('sf-core/data');
const AlertView = require('sf-core/ui/alertview');
const SecureData = require("sf-core/global/securedata");
const Screen = require('sf-core/device/screen');
const Application = require("sf-core/application");
const langChecker = require("./base/langchecker")("language");
langChecker.check(["fingerprintUpdateStoredCredentialsTitle",
    "fingerprintUpdateStoredCredentialsMessage", "yes", "no",
    "useFingerprintTitle", "useFingerprintMessage", "scanFingerprintTitle",
    "scanFingerprintMessage"
]);

//TODO: This is not the correct way of getting TouchId or FaceId is being used
const isIphoneX = (Screen.height === 812 && System.OS === 'iOS' ? true : false); //detect the iphoneX acc to screen height 
const LOGIN_METHOD = (isIphoneX ? "FaceID" : "Fingerprint");
const useTitle = (isIphoneX ? global.lang.useFaceIDTitle : global.lang.useFingerprintTitle);
const useMessage = (isIphoneX ? global.lang.useFaceIDMessage : global.lang.useFingerprintMessage);
const scanTitle = (isIphoneX ? global.lang.scanFaceIDTitle : global.lang.scanFingerprintTitle);
const scanMessage = (isIphoneX ? global.lang.scanFaceIDMessage : global.lang.scanFingerprintMessage);

const USERNAME_KEY = "username";
const PASSWORD_KEY = "password";
const FIELDS = Object.freeze({
    USERNAME: "username",
    PASSWORD: "password",
    REMEMBER_ME: "rememberMe",
    USE_FINGERPRINT: "useFingerprint"
});

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

    }) {
        let p = {
            doNotAskOnFirstTime,
            getField,
            setField,
            loginService,
            dataPrefix,
            serviceName,
            confirmUseFingerprintOnFirstLogin,
            loginHandler
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
        let { serviceName } = privates.get(this);
        let secData = new SecureData({
            ios: {
                service: serviceName
            },
            key: field
        });
        return secData;
    }

    load({
        doNotAutoAskLogin = false,
        rememberMeDisabledForTheFirstTime = false,
        useFingerprintDisabledForTheFirstTime = false
    } = {}) {
        console.log("about to read username");
        return this.getSecureData(FIELDS.USERNAME).read()
            .catch(() => Promise.resolve(""))
            .then(username => {
                console.log("username is", username);
                let rememberMe = this.getBooleanData(FIELDS.REMEMBER_ME);
                let useFingerprint = this.getBooleanData(FIELDS.USE_FINGERPRINT);
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
                    onSuccess: function() {
                        resolve(true);
                    },
                    onError: function(err) {
                        reject(err);
                    }
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
        let rememberMe = this.retrieveField(FIELDS.REMEMBER_ME);

        let useFingerprint = this.retrieveField(FIELDS.USE_FINGERPRINT);
        let canUseFingerprint = System.fingerPrintAvailable && useFingerprint;

        let userNameSec = this.getSecureData(FIELDS.USERNAME);
        let passwordSec = this.getSecureData(FIELDS.PASSWORD);
        let fingerprintValidated = false;

        console.log("start");
        return Promise.all([userNameSec.read()
                .catch(() => Promise.resolve("")),
                passwordSec.read()
                .catch(() => Promise.resolve(""))
            ])
            .then(([storedUserName, storedPassword]) => {
                userNameStored = storedUserName;
                passwordStored = storedPassword;
                return Promise.resolve();
            })
            .then(() => {
                if (canUseFingerprint) {
                    console.log("canUseFingerprint");
                    if (this.isFirstTime) {
                        console.log("it is first time");
                        if (confirmUseFingerprintOnFirstLogin) {
                            console.log("is about to confirm first login");
                            return firstTimeConfirmation()
                                .then(() => {
                                    fingerprintValidated = true;
                                    this.setBooleanData(FIELDS.USE_FINGERPRINT, true);
                                    this.updateField(FIELDS.USE_FINGERPRINT, true);
                                    return Promise.all([
                                        userNameSec.save({ value: userNameUserEntry }),
                                        passwordSec.save({ value: passwordUserEntry })
                                    ]);
                                })
                                .then(() => Promise.resolve(passwordUserEntry))
                                .catch(() => {
                                    this.setBooleanData(FIELDS.USE_FINGERPRINT, false);
                                    this.updateField(FIELDS.USE_FINGERPRINT, false);
                                    return Promise.resolve();
                                });
                        }
                        else {
                            console.log("not going to confirm on fist login");
                            return Promise.resolve(passwordUserEntry);
                        }
                    }
                    else {
                        console.log("it is not the fist time", {
                            userNameUserEntry,
                            userNameStored,
                            passwordUserEntry,
                            "userNameUserEntry === userNameStored": userNameStored === userNameStored,
                            "userNameUserEntry === userNameStored && !passwordUserEntry": userNameStored === userNameStored && !passwordUserEntry
                        });
                        if (userNameUserEntry === userNameStored && !passwordUserEntry) {
                            return Fingerprint.validateFingerPrint()
                                .then(() => {
                                    fingerprintValidated = true;
                                    return Promise.resolve(passwordStored);
                                });
                        }
                        else {
                            return Promise.resolve(passwordUserEntry);
                        }
                    }
                }
                else {
                    console.log("fingerprint not available");
                    return Promise.resolve(passwordUserEntry);
                }

            })
            .then(passwordToUse => {
                console.log("passwords ", {
                    passwordToUse,
                    passwordStored,
                    passwordUserEntry
                });
                return loginService(userNameUserEntry, passwordToUse);
            })
            .then(loginResult => {
                let postOps = [Promise.resolve()];
                if (canUseFingerprint) {
                    if (!this.isFirstTime && rememberMe && (passwordStored !== passwordUserEntry || userNameStored !== userNameUserEntry) && passwordStored !== "" && userNameStored !== "" && passwordUserEntry !== "" && userNameUserEntry !== "") {
                        postOps.push(updateCredentailsConfirmation()
                            .then(() => {
                                if (!fingerprintValidated)
                                    return Fingerprint.validateFingerPrint()
                                        .then(() => {
                                            return Promise.all([
                                                userNameSec.save({ value: userNameUserEntry }),
                                                passwordSec.save({ value: passwordUserEntry })
                                            ]);
                                        });
                            })
                            .catch(() => Promise.resolve())
                        );
                    }
                }
                this.setBooleanData("firstTimePassed", true);
                this.setBooleanData(FIELDS.REMEMBER_ME, rememberMe);
                this.setBooleanData(FIELDS.USE_FINGERPRINT, useFingerprint);
                return Promise.all(postOps)
                    .then(() => {
                        try {
                            let loginHandlerResult = loginHandler(loginResult);
                            if (loginHandlerResult instanceof Promise)
                                return loginHandlerResult;
                            else
                                return Promise.resolve(loginHandlerResult);
                        }
                        catch (ex) {
                            return Promise.reject(ex);
                        }
                    })
                    .then(loginHandlerResult => {
                        if (typeof loginHandlerResult === "undefined")
                            return Promise.resolve(loginResult);
                        else
                            return Promise.resolve(loginHandlerResult);

                    });
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
