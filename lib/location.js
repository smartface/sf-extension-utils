/**
 * Smartface Location module
 * @module location
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2017
 */

const Location = require('sf-core/device/location');
const Application = require('sf-core/application');
const permission = require("./permission");
const expect = require('chai').expect;

var capturedLocation = false,
    pendingLocationRequests = [];

Location.onLocationChanged = onLocationChanged;

function onLocationChanged(location) {
    if (capturedLocation)
        return;
    capturedLocation = true;
    Location.stop();
    pendingLocationRequests.forEach(request => request(location));
    pendingLocationRequests.length = 0;
    capturedLocation = false;
}

exports.getLocation = getLocation;

/**
 * Error first pattern callback
 * @callback location:getLocationCallback
 * @param {object|string} error
 * @param {object} location
 * @param {number} location.longitude
 * @param {number} location.latitude
 */

/**
 * Gets location latitude and logitude. For android it handles permissions by its self
 * @function location:getLocation
 * @param {location:location:getLocationCallback} callback
 * @static
 * @public
 * @see {@link https://developer.smartface.io/docs/location|Location Guide}
 * @example
 * const location = require("sf-extension-utils").location;
 * location.getLocation(function(err, location) {
 *    if (err) return;
 *    requestOptions = {
 *        'url': 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.latitude + ',' + location.longitude + '&sensor=true',
 *        'method': 'GET'
 *    };
 *  });
 */
function getLocation(callback) {
    if (!callback)
        return;
    expect(callback).to.be.a("function");
    Location.onLocationChanged = onLocationChanged;
    permission.getPermission(Application.android.Permissions.ACCESS_FINE_LOCATION,
        function(err) {
            if (err) return callback(err);
            getLocationAction();
        });

    function getLocationAction() {
        pendingLocationRequests.push(function(location) {
            callback(null, location);
        });
        Location.start(Location.android.Provider.AUTO);
    }
}
