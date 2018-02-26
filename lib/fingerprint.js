/**
 * Smartface Fingerprint for login module
 * @module fingerprint
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2017
 */


const System = require('sf-core/device/system');
const Data = require('sf-core/data');
const AlertView = require('sf-core/ui/alertview');
const expect = require('chai').expect;
const KeyboardType = require('sf-core/ui/keyboardtype');
const ActionKeyType = require('sf-core/ui/actionkeytype');
const Screen = require('sf-core/device/screen');
const langChecker = require("./base/langchecker")("language");
langChecker.check(["fingerprintUpdateStoredCredentialsTitle",
    "fingerprintUpdateStoredCredentialsMessage", "yes", "no",
    "useFingerprintTitle", "useFingerprintMessage", "scanFingerprintTitle",
    "scanFingerprintMessage"
]);

exports.init = init;
exports.loginWithFingerprint = loginWithFingerprint;

var isConfigured = false;
var tbUsername;
var tbPassword;
var encryptionFunction = sameReturner;
var decryptionFunction = sameReturner;
var fingerprintCallback;
var isIphoneX = (Screen.height === 812 && System.OS ==='iOS' ? true : false); //detect the iphoneX acc to screen height 
const LOGIN_METHOD = (isIphoneX ? "FaceID": "Fingerprint");
var useTitle = (isIphoneX ? global.lang.useFaceIDTitle : global.lang.useFingerprintTitle);
var useMessage = (isIphoneX ? global.lang.useFaceIDMessage : global.lang.useFingerprintMessage);
var scanTitle  = (isIphoneX ? global.lang.scanFaceIDTitle : global.lang.scanFingerprintTitle);
var scanMessage = (isIphoneX ? global.lang.scanFaceIDMessage : global.lang.scanFingerprintMessage);

const dataKeys = {
    useFingerprintLogin: "useFingerprintLogin",
    username: "username",
    password: "password",
    firstLogin: "firstLogin"
};

/**
 * Encryption or decryption sync functions
 * @callback fingerprint:CryptopgyFunction
 * @param {string} value raw value
 * @returns {string} proccessed value
 */

/**
 * Callback for loginWithFingerprint in error first pattern.
 * @callback fingerprint:loginWithFingerprintCallback
 * @param {object|string} err is set when password cannot be retrieved. In that case continue with regular login.
 * @param {object} fingerprintResult
 * @param {string} fingerprintResult.password read the password value from here
 * @param {function} fingerprintResult.success it is important to call after a successful login
 */


/**
 * Configures fingerprint login. Call this during page show. It is recommended to call it onShow event of the page
 * @function fingerprint:init
 * @param {object} options configuration options
 * @param {UI.TextBox} options.userNameTextBox to use textbox as username or email field. If fingerprint is being used, username is automaticaly set (Required)
 * @param {UI.TextBox} options.passwordTextBox to use textbox as password field (Required)
 * @param {fingerprint:loginWithFingerprintCallback} options.callback is called when fingerprint login is called (Required) This callback is used to obtain password. When the login challege is successful it is important to call the success method of the fingerprintResult argument for the callback
 * @param {boolean} [options.autoLogin = false] to attempt fingerprint login after init. Takes effect after user gives permission and enables the setting
 * @param {boolean} [options.autoEvents = false] sets events to textboxes and button, sets keyboard types
 * @param {fingerprint:CryptopgyFunction} [options.encryptionFunction] stored values are encrypted with the given function
 * @param {fingerprint:CryptopgyFunction} [options.decryptionFunction] stored values are decrypted with the given function
 * @param {object} [options.dataKeys] sets the data key values to store persistent login information
 * @param {string} [options.dataKeys.useFingerprintLogin = useFingerprintLogin] key to store fingerprint login preference
 * @param {string} [options.dataKeys.username = username] key to store username
 * @param {string} [options.dataKeys.password = password] key to store password
 * @param {string} [options.dataKeys.firstLogin = firstLogin] key to store firstLogin
 * @public
 * @static
 * @example
 * const TextBox = require('sf-core/ui/textbox');
 * const fingerprint = require("sf-extension-utils").fingerprint;
 * const tbUsername = new TextBox();
 * const tbPassword = new TextBox({ isPassword: true });
 * const Http = require("sf-core/net/http");
 * const Router = require('sf-core/router');
 * 
 * fingerprint.init({
 *     userNameTextBox: tbUsername,
 *     passwordTextBox: tbPassword,
 *     button: btnLogin,
 *     autoEvents: true,
 *     callback: function(err, fingerprintResult) {
 *         var password;
 *         if (err)
 *             password = tbPassword.text;
 *         else
 *             password = fingerprintResult.password;
 *         if (!password)
 *             return alert("password is required");
 *         loginWithUserNameAndPassword(tbUsername.text, password, function(err) {
 *             if (err)
 *                 return alert("Cannot login. Check user name and password. Or system is down");
 *             fingerprintResult && fingerprintResult.success(); //Important!
 *             Router.go('dashboard', {
 *                 //some data
 *             });
 *         });
 *     }
 * });
 * 
 * function loginWithUserNameAndPassword(username, password, callback) {
 *     Http.request({
 *         url: getTokenUrl,
 *         method: "POST",
 *         body: JSON.stringify({
 *             username,
 *             password
 *         })
 *     }, function(response) {
 *         //handle response
 *         callback(null); //to call .success
 *     }, function(e) {
 *         //invalid credentials?
 *         callback(e);
 *     });
 * }
 */
function init(options) {
    if (isConfigured)
        return;
    expect(options).to.be.an("object");
    expect(options).to.have.property('userNameTextBox').that.is.an('object');
    expect(options.userNameTextBox).to.have.property('text').that.is.a('string');
    expect(options).to.have.property('passwordTextBox').that.is.an('object');
    expect(options.passwordTextBox).to.have.property('text').that.is.a('string');
    expect(options.callback).to.be.a("function");
    typeof options.autoLogin !== "undefined" && expect(options).to.have.property('autoLogin').that.is.a("boolean");
    (options.encryptionFunction || options.decryptionFunction) && expect(options.encryptionFunction).to.be.a("function");
    (options.encryptionFunction || options.decryptionFunction) && expect(options.decryptionFunction).to.be.a("function");
    (typeof options.autoEvents !== "undefined") && expect(options).to.have.property('autoEvents').that.is.a("boolean");
    (options.button) && expect(options).to.have.property('button').that.is.an("object").that.has.property("onPress");
    if (options.dataKeys) {
        expect(options.dataKeys).to.be.an("object");
        options.dataKeys.firstLogin && expect(options.dataKeys.firstLogin).to.be.a("string");
        options.dataKeys.username && expect(options.dataKeys.username).to.be.a("string");
        options.dataKeys.password && expect(options.dataKeys.password).to.be.a("string");
        options.dataKeys.useFingerprintLogin && expect(options.dataKeys.useFingerprintLogin).to.be.a("string");
    }

    tbUsername = options.userNameTextBox;
    tbPassword = options.passwordTextBox;
    fingerprintCallback = options.callback;

    encryptionFunction = options.encryptionFunction || sameReturner;
    decryptionFunction = options.decryptionFunction || sameReturner;

    if (options.dataKeys) {
        dataKeys.useFingerprintLogin = options.dataKeys.useFingerprintLogin || dataKeys.useFingerprintLogin;
        dataKeys.username = options.dataKeys.username || dataKeys.username;
        dataKeys.password = options.dataKeys.password || dataKeys.password;
        dataKeys.firstLogin = options.dataKeys.firstLogin || dataKeys.firstLogin;
    }
    var useFingerprintLogin = !!Data.getBooleanVariable(dataKeys.useFingerprintLogin);
    var storedUserName = Data.getStringVariable(dataKeys.username);

    isConfigured = true;

    if (useFingerprintLogin && storedUserName) {
        tbUsername.text = decryptionFunction(storedUserName);
        options.autoLogin && loginWithFingerprint();
    }

    if (options.autoEvents) {
        if (options.button) {
            let loginButtonOnPress = function loginButtonOnPress() { loginWithFingerprint(); };
            options.button.onPress = loginButtonOnPress;
            tbPassword.onActionButtonPress = function tbPasswordOnActionButtonPress() { loginButtonOnPress(); };
            tbPassword.actionKeyType = ActionKeyType.SEND;
        }
        if (System.OS === "Android")
            tbPassword.keyboardType = KeyboardType.android.TEXTNOSUGGESTIONS;
        tbUsername.actionKeyType = ActionKeyType.NEXT;
        tbUsername.onActionButtonPress = function tbUsernameOnActionButtonPress() { tbPassword.requestFocus(); };
    }

}

/**
 * Triggers fingerprint logon
 * @function fingerprint:loginWithFingerprint
 * @public
 * @static
 * @example
 * const Button = require('sf-core/ui/button');
 * const Router = require('sf-core/router');
 * const Http = require("sf-core/net/http");
 * const fingerprint = require("sf-extension-utils").fingerprint;
 * const btnLogin = new Button({
 *     onPress: function() {
 *         if (!tbUsername.text) {
 *             return alert("Username should not be empty");
 *         }
 *         fingerprint.loginWithFingerprint();
 *     }
 * });
 */
function loginWithFingerprint() {
    expect(fingerprintCallback).to.be.a("function");
    if (!isConfigured)
        throw Error("First you need to configure");
    if (tbUsername.text === "") {
        fingerprintCallback && fingerprintCallback("Empty username");
        return;
    }
    var callback = fingerprintCallback;
    var useFingerprintLogin = !!Data.getBooleanVariable(dataKeys.useFingerprintLogin);
    var firstLogin = !Data.getBooleanVariable(dataKeys.firstLogin);
    var storedUserName = Data.getStringVariable(dataKeys.username);
    var storedPassword = useFingerprintLogin && Data.getStringVariable(dataKeys.password);
    var updateCredentialsWhenSuccess = false;
    if (useFingerprintLogin && System.fingerPrintAvailable && storedUserName) {
        storedUserName = decryptionFunction(storedUserName);
        storedPassword = decryptionFunction(storedPassword);
        if (tbUsername.text !== storedUserName ||
            (tbPassword.text !== "" && tbPassword.text !== storedPassword)) {
            alert({
                title: global.lang.fingerprintUpdateStoredCredentialsTitle || "Update stored credentials",
                message: global.lang.fingerprintUpdateStoredCredentialsMessage || "Would you like to update your stored username and password with newly entered username and password",
                buttons: [{
                    text: global.lang.yes || "Yes",
                    type: AlertView.Android.ButtonType.POSITIVE,
                    onClick: function() {
                        updateCredentialsWhenSuccess = true;
                        resumeWithUpdateCredFlow();
                    },
                }, {
                    text: global.lang.no || "No",
                    type: AlertView.Android.ButtonType.NEGATIVE,
                    onClick: function() {
                        updateCredentialsWhenSuccess = false;
                        resumeWithUpdateCredFlow();
                    },
                }]
            });
        }
        else
            resumeWithUpdateCredFlow();
    }
    else if (firstLogin && System.fingerPrintAvailable) { //first login
        alert({
            title: useTitle || `Use ${LOGIN_METHOD} `,
            message: useMessage || `Would you like to use ${LOGIN_METHOD} login on your future logins?`,
            buttons: [{
                text: global.lang.yes || "Yes",
                type: AlertView.Android.ButtonType.POSITIVE,
                onClick: function() {
                    Data.setBooleanVariable(dataKeys.useFingerprintLogin,
                        useFingerprintLogin = true);
                    updateCredentialsWhenSuccess = true;
                    return validateFingerPrint();
                },
            }, {
                text: global.lang.no || "No",
                type: AlertView.Android.ButtonType.NEGATIVE,
                onClick: function() {
                    Data.setBooleanVariable(dataKeys.useFingerprintLogin,
                        useFingerprintLogin = false);
                    Data.setBooleanVariable(dataKeys.firstLogin,
                        firstLogin = true);
                    return callback(`User does not want to use ${LOGIN_METHOD} `);
                },
            }]
        });
    }
    else {
        if (!System.fingerPrintAvailable)
            return callback("Fingerprint is not available");
        else
            return callback(`User does not choose to use ${LOGIN_METHOD} login`);
    }

    function resumeWithUpdateCredFlow() {
        if (!tbPassword.text) {
            return validateFingerPrint();
        }
        else {
            return callback(null, {
                password: tbPassword.text || storedPassword,
                success: onSuccess
            });
        }
    }

    function validateFingerPrint() {
        System.validateFingerPrint({
            android: {
                title: scanTitle || `Login with ${LOGIN_METHOD} `
            },
            message: scanMessage || `Scan your ${LOGIN_METHOD} `,
            onSuccess: function() {
                return callback(null, {
                    password: tbPassword.text || storedPassword,
                    success: onSuccess
                });
            },
            onError: function() {
                return callback(` ${LOGIN_METHOD} validation failed`);
            }
        });
    }

    function onSuccess() {
        Data.setBooleanVariable(dataKeys.firstLogin,
            firstLogin = true);
        if (!updateCredentialsWhenSuccess || !useFingerprintLogin) {
            return;
        }
        var passwordToStore = tbPassword.text || storedPassword;
        var userNameToStore = tbUsername.text || storedUserName;
        Data.setStringVariable(dataKeys.password, encryptionFunction(passwordToStore));
        Data.setStringVariable(dataKeys.username, encryptionFunction(userNameToStore));
        tbPassword.removeFocus();
    }
}

/**
 * Gets or sets the login with fingerprint preference
 * @prop {boolean} fingerprint:useFingerprintLogin
 * @public
 * @static
 * @example
 * const Switch = require('sf-core/ui/switch');
 * const fingerprint = require("sf-extension-utils").fingerprint;
 * var swLoginWithFingerprint = new Switch({ //switch in app settings
 *  toggle: fingerprint.useFingerprintLogin //set the initial value
 * });
 * swLoginWithFingerprint.onToggleChanged = function() {
 *  //set the updated value
 *  fingerprint.useFingerprintLogin = swLoginWithFingerprint.toggle;
 * };
 */
exports.useFingerprintLogin = null;
Object.defineProperty(exports, "useFingerprintLogin", {
    enumerable: true,
    get: function() {
        return !!Data.getBooleanVariable(dataKeys.useFingerprintLogin);
    },
    set: function(value) {
        value = !!value;
        Data.setBooleanVariable(dataKeys.useFingerprintLogin, value);
        return value;
    }
});



function sameReturner(value) {
    return value;
}
