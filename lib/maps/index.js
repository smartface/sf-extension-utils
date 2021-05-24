/**
 * @module map
 * @type {Object}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 * 
 * Map utility to cover the most popular map applications on both platforms.
 * It will zoom in to the given location in the chosen map app
 * It will prompt a menu to choose apps from on iOS and works out of the box on Android.
 * For this utility to work correctly, you need to publish the application. 
 * You also need to add this key to your info.plist file, for the app to be able to decect them.
 * ```
 * <dict>
 * ...
 * 	<key>LSApplicationQueriesSchemes</key>
 *	    <array>
*		    <string>comgooglemaps</string>
*		    <string>yandexmaps</string>
*	    </array>
* </dict>
* ```
*/
const System = require('sf-core/device/system');
const Application = require('sf-core/application');
const Menu = require('sf-core/ui/menu');
const MenuItem = require('sf-core/ui/menuitem');
const langChecker = require('../base/langchecker')('maps');

langChecker.check(['cancel', 'chooseMapsApp']);

const showMapsMenuForIOS = (function () {
    let menu;
    return function (options) {
        return new Promise((resolve, reject) => {
            // Use from cache if necessary
            menu = menu || createMapsMenuForIOS();

            const { page, location, name } = options;
            const locationName = name || '';
            menu.appleMapsMenuItem.onSelected = () => {
                Application.call(
                    'http://maps.apple.com/', {
                        ll: `${location.latitude},${location.longitude}`,
                        q: encodeURIComponent(locationName)
                    },
                    () => resolve('Apple Maps opened'),
                    () => reject("Apple Maps couldn't be opened")
                );
            };

            if (menu.googleMapsMenuItem) {
                menu.googleMapsMenuItem.onSelected = () => {
                    Application.call(
                        'https://www.google.com/maps/search/', {
                            api: '1',
                            query: `${location.latitude},${location.longitude}`,
                            q: encodeURIComponent(locationName)
                        },
                        () => resolve('Google Maps opened'),
                        () => reject("Google Maps couldn't be opened")
                    );
                };
            }

            if (menu.yandexMapsMenuItem) {
                menu.yandexMapsMenuItem.onSelected = () => {
                    Application.call(
                        'yandexmaps://', {
                            ll: `${location.latitude},${location.longitude}`,
                            text: encodeURIComponent(locationName)
                        },
                        () => resolve('Yandex Maps opened'),
                        () => reject("Yandex Maps couldn't be opened")
                    );
                };
            }
            if (menu.cancelMenuItem) {
                menu.cancelMenuItem.onSelected = () => reject('User canceled');
            }
            menu.items.length ? menu.show(page) : menu.appleMapsMenuItem.onSelected();
            resolve('success');
        });
    };
})();

function showMapsForAndroid({ location, name }) {
    return new Promise((resolve, reject) => {
        const { latitude, longitude } = location;
        const locationName = name || '';
        Application.call(`geo:${latitude},${longitude}?q=${encodeURIComponent(locationName)}`,
            '',
            (e) => resolve(e),
            (e) => reject(e),
            true,
            global.lang.chooseMapsApp || 'Choose Maps App');
    });
};

function createMapsMenuForIOS() {
    const menu = new Menu();
    const menuItems = [];
    const googleMapsAvailable = Application.ios.canOpenUrl('comgooglemaps://');
    const yandexMapsAvailable = Application.ios.canOpenUrl('yandexmaps://');

    const appleMapsMenuItem = new MenuItem({
        title: 'Apple Maps'
    });
    const googleMapsMenuItem = new MenuItem({
        title: 'Google Maps'
    });
    const yandexMapsMenuItem = new MenuItem({
        title: 'Yandex Maps'
    });
    const cancelMenuItem = new MenuItem({
        title: global.lang.cancel || 'Cancel',
        ios: {
            style: MenuItem.ios.Style.CANCEL
        }
    });
    menu.appleMapsMenuItem = appleMapsMenuItem;
    // Google Maps
    if (googleMapsAvailable) {
        menu.googleMapsMenuItem = googleMapsMenuItem;
        menuItems.push(googleMapsMenuItem);
    }
    // Yandex Maps
    if (yandexMapsAvailable) {
        menu.yandexMapsMenuItem = yandexMapsMenuItem;
        menuItems.push(yandexMapsMenuItem);
    }
    if (googleMapsAvailable || yandexMapsAvailable) {
        menuItems.push(appleMapsMenuItem);
        menuItems.push(cancelMenuItem);
    }
    menu.items = menuItems;
    return menu;
}

/**
 * Prompts a menu to choose which maps app to handle the location.
 * It sets the starting point to your current location, if the permission is granted.
 * @function
 * @param options
 * @param {Object} options.page - The main object of current page.
 * @param {string} options.transportType - Your way of travel, driving, walking or bicycling. Accepted parameters = "d", "w", "b"
 * @param {Object} options.location - Destination location which contains latitude and longitude
 * @return {Promise<string>} - returns the message of state
 * @example
 * import { showMapsMenu } from "sf-extension-utils/lib/maps";
 * showMapsMenu({
 *      page,
 *      location: {
 *          latitude: 37.4488259,
 *          longitude: -122.1600047
 *      }
 *  });
 *
 */
function showMapsMenu(options) {
    return System.OS === 'iOS'
        ? showMapsMenuForIOS(options)
        : showMapsForAndroid(options);
}

module.exports = {
    showMapsMenu
};
