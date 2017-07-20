const Application   = require("sf-core/application");
const System        = require("sf-core/device/system");

/**
 * @class PermissionUtil
 * @since 1.1.3
 * 
 * An util class for permissions operations. This util will work for iOS too.
 */
const PermissionUtil = {};

var permissionRequests = [];

/**
 * Check permission and request permission if needed for Android. 
 * Callback will be triggered with boolean variables that indicates grant status.
 * For iOS, callback will be triggered with true.
 * 
 * @param {String} permission
 * @param {Function} callback
 * @param {Boolean} callback.result
 * @method applyPermission
 * @readonly
 * @android
 * @ios
 * @static
 * @since 1.0.0
 */ 
Object.defineProperty(PermissionUtil, "applyPermission", {
    value: function(permission, callback){
        if(Application.android.checkPermission(permission) || System.OS === "iOS"){
            callback && callback(true);
        }
        else{
            var requestCode = generateRandomRequestCode(callback);
            Application.android.requestPermissions(requestCode, permission);
        }
    },
    enumarable: true
});

Application.android.onRequestPermissionsResult = function(e){
    permissionRequests[e.requestCode] && permissionRequests[e.requestCode](e.result);
    permissionRequests.splice(e.requestCode,1);
};

// generating random request code between 1000 and 2000
function generateRandomRequestCode(callback){
    var requestCodes = Object.keys(permissionRequests);
    var randomnumber = Math.ceil(Math.random()*1000) + 10000;
    while(requestCodes.indexOf(randomnumber) !== -1){
        randomnumber = Math.ceil(Math.random()*1000) + 10000;
    }
    permissionRequests[randomnumber] = callback;
    return randomnumber;
}

module.exports = PermissionUtil;