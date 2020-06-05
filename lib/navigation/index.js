/**
 * @module navigation
 * @type {Object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2018
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
const System = require('sf-core/device/system');
const Application = require("sf-core/application");
const Menu = require("sf-core/ui/menu");
const MenuItem = require("sf-core/ui/menuitem");
const langChecker = require("./base/langchecker")("navigation");

langChecker.check(["cancel", "chooseNavigationApp"]);

const showNavigationMenuForIOS = (function() {
    var menu;
    return function(options) {
        return new Promise((resolve, reject) => {
            // Use from cache if necessary
            menu = menu || createNavigationMenuForIOS();

            var { page, transportType = "d", location } = options;
            var isDriving = transportType === "d";

            menu.appleMapsMenuItem.onSelected = () => {
                Application.call(
                    "http://maps.apple.com/", {
                        "daddr": `${location.latitude},${location.longitude}`,
                        "dirflg": isDriving ? "h" : "w"
                    },
                    () => resolve("Apple Maps opened"),
                    () => reject("Apple Maps couldn't be opened")
                );
            };

            if (menu.googleMapsMenuItem) {
                menu.googleMapsMenuItem.onSelected = () => {
                    Application.call(
                        "https://www.google.com/maps/dir/", {
                            "api": "1",
                            "travelmode": isDriving ? "driving" : "walking",
                            "dir_action": "navigate",
                            "destination": `${location.latitude},${location.longitude}`
                        },
                        () => resolve("Google Maps opened"),
                        () => reject("Google Maps couldn't be opened")
                    );
                };
            }

            if (menu.yandexNaviMenuItem) {
                menu.yandexNaviMenuItem.onSelected = () => {
                    Application.call(
                        `yandexnavi://build_route_on_map?lat_to=${location.latitude}&lon_to=${location.longitude}`,
                        null,
                        () => resolve("Yandex navigator opened"),
                        () => reject("Yandex navigator couldn't be opened")
                    );
                };
            }
            if (menu.cancelMenuItem) {
                menu.cancelMenuItem.onSelected = () => reject("User canceled");
            }
            menu.items.length ? menu.show(page) : menu.appleMapsMenuItem.onSelected();
            resolve("success");
        });
    };
})();

const showNavigationMenuForAndroid = function({ transportType = "d", location }) {
    return new Promise((resolve, reject) => {
        let { latitude, longitude } = location;
        Application.call(`geo:${latitude},${longitude}?q=${latitude},${longitude}&mode=${transportType}`,
            "",
            e => { resolve(e) },
            e => { reject(e) },
            true,
            global.lang.chooseNavigationApp || "Choose Navigation App");
    });
};

function createNavigationMenuForIOS() {
    var menu = new Menu();
    var menuItems = [];
    var googleMapsAvailable = Application.ios.canOpenUrl("comgooglemaps://");
    var yandexNaviAvailable = Application.ios.canOpenUrl("yandexnavi://");

    var appleMapsMenuItem = new MenuItem({
        title: "Apple Maps"
    });
    var googleMapsMenuItem = new MenuItem({
        title: "Google Maps"
    });
    var yandexNaviMenuItem = new MenuItem({
        title: "Yandex Navigator"
    });
    var cancelMenuItem = new MenuItem({
        title: global.lang.cancel || "Cancel",
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
    // Yandex Navigator
    if (yandexNaviAvailable) {
        menu.yandexNaviMenuItem = yandexNaviMenuItem;
        menuItems.push(yandexNaviMenuItem);
    }
    if (googleMapsAvailable || yandexNaviAvailable) {
        menuItems.push(appleMapsMenuItem);
        menuItems.push(cancelMenuItem);
    }
    menu.items = menuItems;
    return menu;
}

/**
 * Prompts a menu to choose which navigation app to handle the location.
 * It sets the starting point to your current location, if the permission is granted.
 * @function
 * @param options
 * @param {Object} options.page - The main object of current page.
 * @param {string} options.transportType - Your way of travel, driving, walking or bicycling. Accepted parameters = "d", "w", "b"
 * @param {Object} options.location - Destination location which contains latitude and longitude
 * @return {Promise<string>} - returns the message of state
 * @example
 * const navigation = require("sf-extension-utils/lib/navigation");
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
exports.showNavigationMenu = function(options) {
    return System.OS === "iOS" ?
        showNavigationMenuForIOS(options) :
        showNavigationMenuForAndroid(options);
};
