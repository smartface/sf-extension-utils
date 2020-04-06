/*globals requireClass */

/**
 * Smartface GooglePlayServices Android Module
 * @module googleplayservcies
 * @type {object}
 * @author Hasret Sariyer <hasret.sariyer@smartface.io>
 * @copyright Smartface 2020
 */

/**
 * Helper class for Google Play Services. Android relies on a security Provider to provide secure network communications. 
 * However, from time to time, vulnerabilities are found in the default security provider. 
 * To protect against these vulnerabilities, Google Play services provides a way to automatically 
 * update a device's security provider to protect against known exploits. By calling Google Play services methods, 
 * your app can ensure that it's running on a device that has the latest updates to protect against known exploits.
 * @public
 * @class
 * @see {@link https://developer.android.com/training/articles/security-gms-provider}
 * @example
 *
 * const GooglePlayServices = require("sf-extension-utils/lib/security/googleplayservices");
 * if (System.OS === "Android") {
 *     GooglePlayServices.upgradeSecurityProvider()
 *     .then(() => {
 *         console.info("Provider is up-to-date, app can make secure network calls.");
 *     })
 *     .catch(errorCode => {
 *         console.error("Error code: ", errorCode);
 *     });
 * }
 *
 */
class GooglePlayServices {
	/**
	 * Asynchronously installs the dynamically updatable security provider, if it's not already installed. 
	 * This method must be called on the UI thread.
	 * @method upgradeSecurityProvider
	 * @returns {Promise} resolved and rejected with error code. 
 	 * @see {@link https://developers.google.com/android/reference/com/google/android/gms/common/ConnectionResult}
	 * @public
	 * @static
	 */
	static upgradeSecurityProvider() {
		const GooglePlayServicesUtil = requireClass("io.smartface.android.utils.GooglePlayServicesUtil");
		return new Promise((resolve, reject) => {
			GooglePlayServicesUtil.upgradeSecurityProvider({
				onSuccess: function () {
					resolve();
				},
				onFailure: function (errorCode) {
					reject(errorCode);
				}
			});
		});
	}
}

module.exports = exports = GooglePlayServices;
