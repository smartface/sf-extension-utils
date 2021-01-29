/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable import/no-unresolved */

/**
 * Smartface Location module
 * @module location
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @author Alim Öncül <alim.oncul@smartface.io>
 * @copyright Smartface 2021
 */

/**
 * @typedef {Object} Location
 * @property {number} location.longitude
 * @property {number} location.latitude
 */

/**
 * Gets location latitude and longitude. Handles permissions by itself.
 * @function location:getLocation
 * @param {Function} callback
 * @param {boolean} showSettingsAlert=true
 * @param {string} permissionText
 * @param {string} permissionTitle
 * @return {Promise<Location>} - returns the location
 * @static
 * @public
 * @see {@link https://developer.smartface.io/docs/location|Location Guide}
 * @example
 * import { location } from 'sf-extension-utils/lib/location';
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
export function getLocation(callback?: () => {}, showSettingsAlert = true, permissionText: string, permissionTitle?: string): Promise<{ latitude: number, longitude: number }>;