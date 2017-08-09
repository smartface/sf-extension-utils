/**
 * Smartface Android Permission module
 * @module permission
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2017
 */

const System = require('sf-core/device/system');
const Application = require("sf-core/application");
var lastRequestPermissionCode = 2000;
const permissionRequestMap = {};
const AlertView = require('sf-core/ui/alertview');
const langChecker = require("./base/langchecker")("permission");
const expect = require('chai').expect;
langChecker.check(["permissionRequiredMessage", "permissionRequiredTitle"]);

exports.getPermission = getPermission;

/**
 * Run-time permission requests for Android if needed. iOS automatically succeeds.
 * Permission request numbers starts from 2000 and incremented on each requestPermission
 * @function permission:getPermission
 * @param {Application.android.Permissions|Application.android.Permissions[]} permissions permission(s) to get
 * @param {string} [rationaleDisplay] optional parameter for rationale text
 * @param {function} callback error first pattern fired when permissions are requested if needed
 * @static
 * @public
 * @see {@link http://ref.smartface.io/#!/api/Application.android.Permissions|Permission Types}
 * @see {@link https://developer.smartface.io/docs/application-permission-management|Application Permission Management}
 * @example
 * const permission = require("sf-extension-utils").permission
 * const Application = require("sf-core/application");
 * permission.getPermission(Application.android.Permissions.ACCESS_FINE_LOCATION,
 *  function(err) {
 *      if (err) return callback(err);
 *          getLocationAction();
 *  });
 */
function getPermission(permissions, rationaleDisplay, callback) {
    Application.android.onRequestPermissionsResult = onRequestPermissionsResult;
    if (!callback) {
        callback = rationaleDisplay;
        rationaleDisplay = null;
    }

    callback && expect(callback).to.be.a("function");
    rationaleDisplay && expect(rationaleDisplay).to.a("string");

    if (System.OS === "iOS") { //hardcoded logic for iOS to pass
        callback && callback(null);
        return;
    }

    if (!(permissions instanceof Array)) {
        expect(permissions).to.be.a("string");
        permissions = [permissions];
    }


    var i, p, rationalsToShow = [];
    for (i = permissions.length - 1; i > -1; i--) {
        p = permissions[i];
        expect(p).to.be.a("string");
        if (Application.android.checkPermission(p)) {
            permissions.splice(i, 1);
        }
        if (Application.android.shouldShowRequestPermissionRationale(p)) {
            rationalsToShow.push(p);
        }
    }
    if (permissions.length === 0) {
        callback && callback(null); //all granted
        return;
    }

    if (rationalsToShow.length > 0) {
        if (rationaleDisplay) {
            rationaleDisplay(rationalsToShow, rationalDisplayCallback);
        }
        else {
            displayRationale(rationalsToShow, rationalDisplayCallback);
        }
    }
    else
        rationalDisplayCallback(null);

    function rationalDisplayCallback(err) {
        if (err) {
            callback && callback(err);
        }
        else {
            continueRequestPermissions();
        }
    }

    function continueRequestPermissions() {
        var requestPermissionCode = lastRequestPermissionCode++;
        permissionRequestMap[requestPermissionCode] = {
            requestPermissionCode: requestPermissionCode,
            result: function(e) {
                callback && callback(!e.result);
            }
        };
        var checkPermissionArguments = [requestPermissionCode].concat(permissions);
        Application.android.requestPermissions.apply(Application, checkPermissionArguments);
    }

}

function displayRationale(permissions, callback) {
    alert({
        title: global.lang.permissionRequiredTitle || "Permissions required",
        message: global.lang.permissionRequiredMessage || "In order to application to work properly following permissions are to be granted" + ":\n" +
            permissions.join(",\n"),
        buttons: [{
            text: "OK",
            onClick: function() {
                callback && callback(null);
            },
            index: AlertView.Android.ButtonType.POSITIVE,
        }, {
            text: "Cancel",
            onClick: function() {
                callback && callback("user cancelled permission rationale displayed");
            },
            index: AlertView.Android.ButtonType.NEGATIVE,
        }]
    });
}

function onRequestPermissionsResult(e) {
    var permissionRequest = permissionRequestMap[e.requestCode];
    permissionRequest && permissionRequest.result(e);
}

Application.android.onRequestPermissionsResult = onRequestPermissionsResult;
