/*globals lang */
const System = require('sf-core/device/system');
const Application = require("sf-core/application");
var lastRequestPermissionCode = 2000;
var permissionRequestMap = {};
const AlertView = require('sf-core/ui/alertview');
exports.checkPermission = function checkPermission(permissions, rationaleDisplay, callback) {
    if (!callback) {
        callback = rationaleDisplay;
        rationaleDisplay = null;
    }
    
    if (System.OS === "iOS") { //hardcoded logic for iOS to pass
        callback && callback(null);
        return;
    }

    if (!(permissions instanceof Array)) permissions = [permissions];


    var i, p, rationalsToShow = [];
    for (i = permissions.length - 1; i > -1; i--) {
        p = permissions[i];
        if (typeof p !== "string") {
            throw Error(String(p) + " is not a valid permission");
        }
        //p = permissions[i] = p.toUpperCase();
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
            callback(err);
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
                //var allPassed = true,
                //    i, result = {},
                //    keys = Object.keys(e.results);
                ////Using keys for bypassing AND-2351
                //for (i = 0; i < keys.length; i++) {
                //    allPassed = allPassed && e.results[i];
                //    result[e.requestedPermissions[i]] = e.results[i];
                //}
                callback(!e.result);
            }
        };
        var checkPermissionArguments = [requestPermissionCode].concat(permissions);
        Application.android.requestPermissions.apply(Application, checkPermissionArguments);
    }

};

function displayRationale(permissions, callback) {
    alert({
        title: lang.permissionRequiredTitle || "Permissions required",
        message: lang.permissionRequiredMessage || "In order to application to work properly following permissions are to be granted:\n" +
            permissions.join(",\n"),
        buttons: [{
            text: "OK",
            onClick: function() {
                callback(null);
            },
            index: AlertView.Android.ButtonType.POSITIVE,
        }, {
            text: "Cancel",
            onClick: function() {
                callback("user cancelled permission rationale displayed");
            },
            index: AlertView.Android.ButtonType.NEGATIVE,
        }]
    });
}

Application.android.onRequestPermissionsResult = function onRequestPermissionsResult(e) {
    var permissionRequest = permissionRequestMap[e.requestCode];
    permissionRequest && permissionRequest.result(e);
};