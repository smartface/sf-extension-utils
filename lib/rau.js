/**
 * Smartface Remote App Update module
 * @module rau
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2017
 */

const Application = require("sf-core/application");
const AlertView = require('sf-core/ui/alertview');
const Network = require('sf-core/device/network');
const permission = require('./permission');
const expect = require('chai').expect;
const skipErrList = ["channel not found", "No update", "profile not found"];
const langChecker = require("./base/langchecker")("rau");

langChecker.check(["noInternetMessage", "noInternetTitle", "checkingUpdate",
    "rauProfileError", "rauChannelError", "noUpdate", "newVersionAvailable",
    "version", "isReadyToInstall", "updateMandatory", "updateOptional",
    "updateNow", "later", "updateIsInProgress", "updateFail"
]);

exports.checkUpdate = checkUpdate;

/**
 * Checks RAU updates. If there is new update available, the update dialog will be shown to the user 
 * if silent parameter not given. This function will handle permission operations internally for Android. 
 * @function rau:checkUpdate
 * @param {object} [options]
 * @param {boolean} [options.showProgressCheck = false] Show dialog while checking updates.
 * @param {boolean} [options.showProgressErrorAlert = false] Show error dialog when error accurs.
 * @param {boolean} [options.silent = false] Update and restart without interacting with user.
 * @param {string} [options.url] to open for incompatible updates (optional)
 * @static
 * @public
 * @see {@link https://developer.smartface.io/docs/remote-app-update|Remote App Update Guide}
 * @example
 * const System = require("sf-core/device/system");
 * const rau = require("sf-extension-utils").rau;
 * rau.checkUpdate({
 *  showProgressCheck: true,
 *  showProgressErrorAlert: true,
 *  silent: false,
 *  url: System.OS === "Android"? androidURL: iOSURL
 * });
 */
function checkUpdate(options) {
    if (options) {
        expect(options).to.be.an("object");
        if (typeof options.showProgressCheck !== "undefined")
            expect(options).to.have.property('showProgressCheck').that.is.a('boolean');
        if (typeof options.showProgressErrorAlert !== "undefined")
            expect(options).to.have.property('showProgressErrorAlert').that.is.a('boolean');
        if (typeof options.silent !== "undefined")
            expect(options).to.have.property('silent').that.is.a('boolean');
        options.url && expect(options.url).to.be.a("string");
    }

    options = options || {};

    if (Network.connectionType === Network.ConnectionType.None) {
        if (!options.silent)
            alert(global.lang.noInternetMessage || "No Internet Connection",
                global.lang.noInternetTitle || "Cannot Connect");
        return;
    }

    //Checks if there is a valid update. If yes returns result object.
    var updateProgressAlert;
    if (options.showProgressCheck) {
        updateProgressAlert = alert(global.lang.checkingUpdate || "Checking for updates");
    }
    Application.checkUpdate(function(err, result) {
        updateProgressAlert && updateProgressAlert.dismiss();

        if (err) {
            if (typeof err === "object") {
                try {
                    err = JSON.stringify(err, null, "\t");
                }
                finally {}
            }

            if (options.showProgressErrorAlert) {
                if (err === "profile not found") {
                    // things to check:
                    // 1 - Rau key in project.rau.json is correct
                    // 2 - You have published to rau before

                    alert(global.lang.rauProfileError || "Update profile not found");
                }
                else if (err === "channel not found") {
                    // make sure that channel exists
                    alert(global.lang.rauChannelError || "Update channel not found");
                }
                else if (err === "No update") {
                    // Make sure that you have actived at least a version in that channel and OS
                    alert(global.lang.noUpdate || "No new updates were found");
                }
            }
            if (skipErrList.indexOf(err) !== -1)
                return;
            if (err === "Update is not compatible" && typeof options.url === "string") {
                Application.call(options.url);
            }
        }
        else {
            //Update check is successful. We can show the meta info to inform our app user.
            result.meta = result.meta || {};
            var isMandatory = (result.meta.isMandatory && result.meta.isMandatory === true) ? true : false;
            var updateTitle = (result.meta.title) ? result.meta.title : (global.lang.newVersionAvailable || 'A new update is ready!');
            var updateMessage = (global.lang.version || "Version") + " " + result.newVersion + " " + (global.lang.isReadyToInstall || "is ready to install") + ".\n\n";
            updateMessage += (isMandatory) ? (global.lang.updateMandatory || "This update is mandatory!") :
                (global.lang.updateOptional || "Do you want to update?");

            if (options.silent) {
                startUpdate(result);
            }
            else {
                if (isMandatory) {
                    alert({
                        title: updateTitle,
                        message: updateMessage,
                        buttons: [{
                            text: global.lang.updateNow || "Update now",
                            onClick: function() {
                                startUpdate(result);
                            },
                            type: AlertView.Android.ButtonType.POSITIVE
                        }]
                    });
                }
                else {
                    alert({
                        title: updateTitle,
                        message: updateMessage,
                        buttons: [{
                            text: global.lang.updateNow || "Update now",
                            onClick: function() {
                                startUpdate(result);
                            },
                            type: AlertView.Android.ButtonType.POSITIVE
                        }, {
                            text: global.lang.later || "Later",
                            onClick: doNothing,
                            type: AlertView.Android.ButtonType.NEGATIVE
                        }]
                    });
                }
            }
        }
    });
}

function startUpdate(result) {
    permission.getPermission(Application.android.Permissions.WRITE_EXTERNAL_STORAGE, function(err) {
        if (!err) {
            performUpdate(result);
        }
    });
}

function performUpdate(result) {
    var updateProgressAlert = alert({
        message: global.lang.updateIsInProgress || "Update is in progress",
        buttons: []
    });
    if (result.meta.redirectURL && result.meta.redirectURL.length != 0) {
        //RAU wants us to open a URL, most probably core/player updated and binary changed.
        updateProgressAlert.dismiss();
        Application.call(result.meta.redirectURL);
    }
    else {
        //There is an update waiting to be downloaded. Let's download it.
        result.download(function(err, result) {
            if (err) {
                //Download failed
                updateProgressAlert.dismiss();
                handleError(err);
            }
            else {
                //All files are received, we'll trigger an update.
                result.updateAll(function(err) {
                    updateProgressAlert.dismiss();
                    if (err) {
                        //Updating the app with downloaded files failed
                        handleError(err);
                    }
                    else {
                        //After that the app will be restarted automatically to apply the new updates
                        Application.restart();
                    }
                });
            }
        });
    }
}

function handleError(err) {
    if (typeof err === "object") {
        try {
            err = JSON.stringify(err, null, "\t");
        }
        finally {

        }
    }
    alert((global.lang.updateFail || "Update failed") + ": " + err);
}

//We will do nothing on cancel for the time being.
function doNothing() {
    //do nothing
}
