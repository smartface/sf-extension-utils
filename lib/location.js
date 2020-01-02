/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable import/no-unresolved */

/**
 * Smartface Location module
 * @module location
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2020
 */

const System = require('sf-core/device/system');
const Location = require('sf-core/device/location');
const Application = require('sf-core/application');
const { getPermission } = require('sf-extension-utils/lib/permission');

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
 *
 * location.getLocation()
 *     .then(location => {
 *         let requestOptions = {
 *             'url': 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.latitude + ',' + location.longitude + '&sensor=true',
 *             'method': 'GET'
 *         };
 *     })
 *     .catch(e => {
 *         // e parameter can be one of these values:
 *         // "RESTRICTED" / iOS specific, this is returned if authorization status is Location.iOS.AuthorizationStatus.RESTRICTED
 *         // "OTHER" / Android specific, this is returned if the operation failed with no more detailed information
 *         // "DENIED" / Returned for all other cases
 *         console.log("Location cannot be retrieved");
 *     });
 */

function getLocation() {
    const getLocationPromise = System.OS === 'iOS' ? getLocationForIOS() : getLocationForAndroid();
    return getLocationPromise;
}

function getLocationForIOS() {
    return new Promise((resolve, reject) => {
        const authorizationStatus = Location.ios.getAuthorizationStatus();
        if (authorizationStatus === Location.iOS.AuthorizationStatus.AUTHORIZED) {
            getLocationAction().then(resolve);
        } else if (authorizationStatus === Location.iOS.AuthorizationStatus.DENIED) {
            reject('DENIED');
        } else if (authorizationStatus === Location.iOS.AuthorizationStatus.NOTDETERMINED) {
            Location.start();
            Location.ios.onChangeAuthorizationStatus = (permissionGranted) => {
                Location.ios.onChangeAuthorizationStatus = noop;
                if (permissionGranted) {
                    getLocationAction().then(resolve);
                } else {
                    reject('DENIED');
                }
            };
        } else if (authorizationStatus === Location.iOS.AuthorizationStatus.RESTRICTED) {
            reject('RESTRICTED');
        }
    });
}

function getLocationForAndroid() {
    return getPermission(Application.Android.Permissions.ACCESS_FINE_LOCATION)
        .then(getLocationActionForAndroid);
}

function getLocationAction() {
    return new Promise((resolve) => {
        Location.start();
        Location.onLocationChanged = (location) => {
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
                getLocationAction().then(resolve);
            },
            onFailure: (e) => {
                if (e.statusCode === Location.Android.SettingsStatusCodes.DENIED) {
                    reject('DENIED');
                } else {
                    reject('OTHER');
                }
            }
        });
    });
}

exports.getLocation = getLocation;
