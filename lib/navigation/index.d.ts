/**
 * @module navigation
 * @type {Object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 * 
 * GPS navigation utility to cover the most popular navigating applications on both platforms.
 * It will prompt a menu to choose apps from on iOS and works out of the box on Android.
 * For this utility to work correctly, you need to publish the application. 
 * You also need to add this key to your info.plist file, for the app to be able to decect them.
 * ```
 * <dict>
 * ...
 * 	<key>LSApplicationQueriesSchemes</key>
 *	    <array>
 *		    <string>comgooglemaps</string>
 *		    <string>yandexnavi</string>
 *	    </array>
 * </dict>
 * ```
 */

import Page = require('@smartface/native/ui/page');

/**
 * Prompts a menu to choose which navigation app to handle the location.
 * It sets the starting point to your current location, if the permission is granted.
 * @function
 * @param {Object} page - The main object of current page.
 * @param {string} transportType - Your way of travel, driving, walking or bicycling. Accepted parameters = "d", "w", "b"
 * @param {Object} location - Destination location which contains latitude and longitude
 * @return {Promise<string>} - returns the message of state
 * @example
 * import { showNavigationMenu } from 'sf-extension-utils/lib/navigation';
 * navigation.showNavigationMenu({
 *      page,
 *      transportType: "d",
 *      location: {
 *          latitude: 37.4488259,
 *          longitude: -122.1600047
 *      }
 *  });
 * 
 */
export function showNavigationMenu(options: { page: Page, transportType: string, location: { latitude: number, longitude: number }}): Promise<string>;
