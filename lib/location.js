/**
 * Smartface Location module
 * @module location
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2018
 */

const System = require("sf-core/device/system");
const Location = require("sf-core/device/location");
const Application = require("sf-core/application");
const permission = require("./permission");
const noop = () => {};

/**
 * @typedef {Object} Location
 * @property {number} location.longitude
 * @property {number} location.latitude
 */

/**
 * Gets location latitude and longitude. Handles permissions by itself.
 * @function location:getLocation
 * @return {Promise<Location>} - returns the location
 * @static
 * @public
 * @see {@link https://developer.smartface.io/docs/location|Location Guide}
 * @example
 * const location = require("sf-extension-utils/lib/location");
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
 */

function getLocation() {
    return System.OS === "iOS" ? getLocationForIOS() : getLocationForAndroid();
}

function getLocationForIOS() {
    return new Promise((resolve, reject) => {
        let authorizationStatus = Location.ios.getAuthorizationStatus();
        if (authorizationStatus === Location.iOS.AuthorizationStatus.AUTHORIZED) {
            getLocationAction().then(resolve);
        }
        else if (authorizationStatus === Location.iOS.AuthorizationStatus.DENIED) {
            reject();
        }
        else if (authorizationStatus === Location.iOS.AuthorizationStatus.NOTDETERMINED) {
            Location.start();
            Location.ios.onChangeAuthorizationStatus = permissionGranted => {
                Location.ios.onChangeAuthorizationStatus = noop;
                if (permissionGranted) {
                    getLocationAction().then(resolve);
                }
                else {
                    reject();
                }
            };
        }
        else if (authorizationStatus === Location.iOS.AuthorizationStatus.RESTRICTED) {
            reject();
        }
    });
}

function getLocationForAndroid() {
    return Promise((resolve, reject) => {
        let permissionGranted = Application.android.checkPermission(Application.android.Permissions.ACCESS_FINE_LOCATION);
        if (permissionGranted) {
            getLocationAction().then(resolve);
        }
        else {
            permission.getPermission(Application.android.Permissions.ACCESS_FINE_LOCATION, noop,
                err => {
                    err ? reject() : getLocationAction().then(resolve);
                });
        }
    });
}

function getLocationAction() {
    return new Promise(resolve => {
        Location.start();
        Location.onLocationChanged = (location) => {
            Location.onLocationChanged = noop;
            Location.stop();
            resolve(location);
        };
    });
}

exports.getLocation = getLocation;
