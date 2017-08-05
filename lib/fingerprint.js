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
const Application = require("sf-core/application");
const permission = require("./permission");
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

const dataKeys = {
    usefingerprintlogin: "usefingerprintlogin",
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
 * Configures fingerprint login. Call this during page load
 * @function fingerprint:init
 * @param {object} options configuration options
 * @param {UI.TextBox} options.userNameTextBox to use textbox as username or email field. If fingerprint is being used, username is automaticaly set
 * @param {UI.TextBox} options.passwordTextBox to use textbox as password field
 * @param {fingerprint:CryptopgyFunction} [options.encryptionFunction] stored values are encrypted with the given function
 * @param {fingerprint:CryptopgyFunction} [options.decryptionFunction] stored values are decrypted with the given function
 * @param {object} [options.dataKeys] sets the data key values to store persistent login information
 * @param {string} [options.dataKeys.usefingerprintlogin = usefingerprintlogin] key to store fingerprint login preference
 * @param {string} [options.dataKeys.username = username] key to store username
 * @param {string} [options.dataKeys.password = password] key to store password
 * @param {string} [options.dataKeys.firstLogin = firstLogin] key to store firstLogin
 * @public
 * @static
 * @example
 * const TextBox = require('sf-core/ui/textbox');
 * const fingerprint = require("sf-extension-utils").fingerprint;
 * const tbUsername = new TextBox();
 * const tbPassword = new TextBox({isPassword: true});
 * fingerprint.init({
 *  userNameTextBox: tbUsername,
 *  passwordTextBox: tbPassword
 * });
 */
function init(options) {
    tbUsername = options.userNameTextBox;
    tbPassword = options.passwordTextBox;

    encryptionFunction = options.encryptionFunction || sameReturner;
    decryptionFunction = options.decryptionFunction || sameReturner;

    if (options.dataKeys) {
        dataKeys.usefingerprintlogin = options.dataKeys.usefingerprintlogin || dataKeys.usefingerprintlogin;
        dataKeys.username = options.dataKeys.username || dataKeys.username;
        dataKeys.password = options.dataKeys.password || dataKeys.password;
        dataKeys.firstLogin = options.dataKeys.firstLogin || dataKeys.firstLogin;
    }
    var usefingerprintlogin = !!Data.getBooleanVariable(dataKeys.usefingerprintlogin);
    var storedUserName = Data.getStringVariable(dataKeys.username);
    if (usefingerprintlogin && storedUserName) {
        tbUsername.text = decryptionFunction(storedUserName);
    }

    isConfigured = true;
}

/**
 * Callback for loginWithFingerprint in error first pattern.
 * @callback fingerprint:loginWithFingerprintCallback
 * @param {object|string} err is set when password cannot be retrieved. In that case continue with regular login.
 * @param {object} fingerprintResult
 * @param {string} password read the password value from here
 * @param {function} success it is important to call after a successful login
 */

/**
 * Retrieves password to login based on the rules.
 * Perform validation of password by the retrieved value.
 * After retriving password and performing a successful login, it is important to call .success() method of the callback argument. Otherwise data will not be stored!
 * @function fingerprint:loginWithFingerprint
 * @param {fingerprint:loginWithFingerprintCallback} callback
 * @public
 * @static
 * @example
 * const Button = require('sf-core/ui/button');
 * const Router = require('sf-core/router');
 * const Http = require("sf-core/net/http");
 * const fingerprint = require("sf-extension-utils").fingerprint;
 * const btnLogin = new Button({
 *     onPress: function() {
 *         var isValid = true;
 * 
 *         if (!tbUsername.text) {
 *             isValid = false
 *         }
 *         var password;
 *         isValid && fingerprint.loginWithFingerprint(function(err, fingerprintResult) {
 *             if (err)
 *                 password = tbPassword.text;
 *             else
 *                 password = fingerprintResult.password;
 *             if (!password)
 *                 isValid = false;
 *             !isValid && alert("password is required");
 *             loginWithUserNameAndPassword(tbUsername.text, password, function(err) {
 *                 if (err)
 *                     return alert("Cannot login");
 *                 fingerprintResult && fingerprintResult.success(); //Important!
 *                 Router.go('dashboard', {
 *                     //some data
 *                 });
 * 
 *             });
 * 
 *         });
 *         !isValid && alert("username is required");
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
 *     })
 * }
 */
function loginWithFingerprint(callback) {
    if (!isConfigured)
        throw Error("First you need to configure");
    if (tbUsername.text === "") {
        callback && callback("Empty username");
        return;
    }
    var usefingerprintlogin = !!Data.getBooleanVariable(dataKeys.usefingerprintlogin);
    var firstLogin = !Data.getBooleanVariable(dataKeys.firstLogin);
    var storedUserName = Data.getStringVariable(dataKeys.username);
    var storedPassword = Data.getStringVariable(dataKeys.password);
    var updateCredentialsWhenSuccess = false;
    if (usefingerprintlogin && System.fingerPrintAvailable && storedUserName) {
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
                        },
                    },
                    {
                        text: global.lang.no || "No",
                        type: AlertView.Android.ButtonType.NEGATIVE,
                        onClick: function() {
                            updateCredentialsWhenSuccess = false;
                        },
                    }
                ]
            });
        }
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
    else if (firstLogin) { //first login
        alert({
            title: global.lang.useFingerprintTitle || "Use Fingerprint",
            message: global.lang.useFingerprintMessage || "Would you like to use fingerprint login on your future logins?",
            buttons: [{
                    text: global.lang.yes || "Yes",
                    type: AlertView.Android.ButtonType.POSITIVE,
                    onClick: function() {
                        Data.setBooleanVariable(dataKeys.usefingerprintlogin,
                            usefingerprintlogin = true);
                        updateCredentialsWhenSuccess = true;
                        return validateFingerPrint();
                    },
                },
                {
                    text: global.lang.no || "No",
                    type: AlertView.Android.ButtonType.NEGATIVE,
                    onClick: function() {
                        Data.setBooleanVariable(dataKeys.usefingerprintlogin,
                            usefingerprintlogin = false);
                        return callback("User does not want to use fingerprint");
                    },
                }
            ]
        });
    }
    else {
        if (!System.fingerPrintAvailable)
            return callback("Fingerprint is not available");
        else
            return callback("User does not choose to use fingerprint login");
    }

    function validateFingerPrint() {
        permission.getPermission(Application.android.Permissions.USE_FINGERPRINT, function(err) {
            if (err) {
                callback(err);
                return;
            }
            System.validateFingerPrint({
                android: {
                    title: global.lang.scanFingerprintTitle || "Login with fingerprint"
                },
                message: global.lang.scanFingerprintMessage || "Scan your finger",
                onSuccess: function() {
                    return callback({
                        password: tbPassword.text || storedPassword,
                        success: onSuccess
                    });
                },
                onError: function() {
                    return callback("Fingerprint validation failed");
                }
            });
        });
    }

    function onSuccess() {
        Data.setBooleanVariable(dataKeys.firstLogin,
            firstLogin = true);
        if (!updateCredentialsWhenSuccess) {
            return;
        }
        var passwordToStore = tbPassword.text || storedPassword;
        var userNameToStore = tbUsername.text || storedUserName;
        Data.setStringVariable(dataKeys.password, encryptionFunction(passwordToStore));
        Data.setStringVariable(dataKeys.username, encryptionFunction(userNameToStore));
    }
}

/**
 * Gets or sets the login with fingerprint preference
 * @prop {boolean} fingerprint:usefingerprintlogin
 * @public
 * @static
 * @example
 * const Switch = require('sf-core/ui/switch');
 * const fingerprint = require("sf-extension-utils").fingerprint;
 * var swLoginWithFingerprint = new Switch({ //switch in app settings
 *  toggle: fingerprint.usefingerprintlogin //set the initial value
 * });
 * swLoginWithFingerprint.onToggleChanged = function() {
 *  //set the updated value
 *  fingerprint.usefingerprintlogin = swLoginWithFingerprint.toggle;
 * };
 */
exports.usefingerprintlogin = null;
Object.defineProperty(exports, "usefingerprintlogin", {
    enumerable: true,
    get: function() { return !!Data.getBooleanVariable(dataKeys.usefingerprintlogin); },
    set: function(value) {
        value = !!value;
        Data.setBooleanVariable(dataKeys.usefingerprintlogin, value);
        return value;
    }
});



function sameReturner(value) {
    return value;
}
