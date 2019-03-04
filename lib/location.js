/**
 * Smartface Location module
 * @module location
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

const System = require("sf-core/device/system");
const Location = require("sf-core/device/location");
const Application = require("sf-core/application");
const noop = () => {};

/**
 * @typedef {Object} Location
 * @property {number} location.longitude
 * @property {number} location.latitude
 */

/**
 * Gets location latitude and longitude. Handles permissions by itself.
 * @function location:getLocation
 * @return {(Promise<Location>|undefined)} - returns the location
 * @static
 * @public
 * @see {@link https://developer.smartface.io/docs/location|Location Guide}
 * @example
 * const location = require("sf-extension-utils/lib/location");
 * 
 * // First usage - Promise
 * location.getLocation()
 *     .then(location => {
 *         let requestOptions = {
 *             'url': 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.latitude + ',' + location.longitude + '&sensor=true',
 *             'method': 'GET'
 *         };
 *     })
 *     .catch(() => {
 *         console.log("Location cannot be retrieved");
 *     });
 * 
 * // Second usage - Error first pattern (for backward compatibility)
 * location.getLocation(function(err, location) {
 *    if (err)
 *        return;
 *    let requestOptions = {
 *        'url': 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.latitude + ',' + location.longitude + '&sensor=true',
 *        'method': 'GET'
 *    };
 *  });
 *
 */

function getLocation(callback) {
    var getLocationPromise = System.OS === "iOS" ? getLocationForIOS() : getLocationForAndroid();
    if (callback) {
        getLocationPromise
            .then(location => callback(null, location))
            .catch(e => callback(e));
    }
    else {
        return getLocationPromise;
    }
}

function getLocationForIOS() {
    return new Promise((resolve, reject) => {
        let authorizationStatus = Location.ios.getAuthorizationStatus();
        if (authorizationStatus === Location.iOS.AuthorizationStatus.AUTHORIZED) {
            getLocationAction().then(resolve);
        }
        else if (authorizationStatus === Location.iOS.AuthorizationStatus.DENIED) {
            reject("authorizationStatus DENIED");
        }
        else if (authorizationStatus === Location.iOS.AuthorizationStatus.NOTDETERMINED) {
            Location.start();
            Location.ios.onChangeAuthorizationStatus = permissionGranted => {
                Location.ios.onChangeAuthorizationStatus = noop;
                if (permissionGranted) {
                    getLocationAction().then(resolve);
                }
                else {
                    reject("authorizationStatus DENIED");
                }
            };
        }
        else if (authorizationStatus === Location.iOS.AuthorizationStatus.RESTRICTED) {
            reject("authorizationStatus RESTRICTED");
        }
    });
}

function getLocationForAndroid() {
    return new Promise((resolve, reject) => {
        let permissionGranted = Application.android.checkPermission(Application.android.Permissions.ACCESS_FINE_LOCATION);
        if (permissionGranted) {
            getLocationActionForAndroid()
                .then(resolve)
                .catch(reject);
        }
        else {
            let requestCode = 1003;
            Application.android.requestPermissions(requestCode, Application.Android.Permissions.ACCESS_FINE_LOCATION);
            Application.android.onRequestPermissionsResult = e => {
                Application.android.onRequestPermissionsResult = noop;
                if (e.requestCode === requestCode && e.result) {
                    getLocationActionForAndroid()
                        .then(resolve)
                        .catch(reject);
                }
                else {
                    reject(e);
                }
            };
        }
    });
}

function getLocationAction() {
    return new Promise(resolve => {
        Location.start();
        Location.onLocationChanged = location => {
            Location.onLocationChanged = noop;
            Location.stop();
            resolve(location);
        };
    });
}

function getLocationActionForAndroid() {
    return new Promise((resolve, reject) => {
        Location.android.checkSettings({
            onSuccess: () => {
                getLocationAction()
                    .then(resolve)
                    .catch(reject);
            },
            onFailure: e => reject(e)
        });
    });
}

exports.getLocation = getLocation;
