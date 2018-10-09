/**
 * @module navigation
 * @type {Object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
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
        // Use from cache if necessary
        menu = menu || createNavigationMenuForIOS();

        var { page, transportType, location } = options;
        var isDriving = transportType === "d";

        if (menu.appleMapsMenuItem) {
            menu.appleMapsMenuItem.onSelected = () => {
                Application.call("http://maps.apple.com/", {
                    "daddr": `${location.latitude},${location.longitude}`,
                    "dirflg": isDriving ? "h" : "w"
                });
            };
        }
        if (menu.googleMapsMenuItem) {
            menu.googleMapsMenuItem.onSelected = () => {
                Application.call("https://www.google.com/maps/dir/", {
                    "api": "1",
                    "travelmode": isDriving ? "driving" : "walking",
                    "dir_action": "navigate",
                    "destination": `${location.latitude},${location.longitude}`,
                });
            };
        }

        if (menu.yandexNaviMenuItem) {
            menu.yandexNaviMenuItem.onSelected = () => {
                Application.call(`yandexnavi://build_route_on_map?lat_to=${location.latitude}&lon_to=${location.longitude}`);
            };
        }
        menu.show(page);
    };
})();

function createNavigationMenuForIOS() {
    var menu = new Menu();
    var menuItems = [];
    var appleMapsAvailable = Application.ios.canOpenUrl("http://maps.apple.com/");
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

    // Apple Maps
    if (appleMapsAvailable) {
        menu.appleMapsMenuItem = appleMapsMenuItem;
        menuItems.push(appleMapsMenuItem);
    }
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

    menuItems.push(cancelMenuItem);
    menu.items = menuItems;
    return menu;
}

/**
 * Prompts a menu to choose which navigation app to handle the location.
 * It sets the starting point to your current location, if the permission is granted.
 * @function
 * @param {Object} page - The main object of current page.
 * @param {string} transportType - Your way of travel, driving, walking or bicycling. Accepted parameters = "d", "w", "b"
 * @param {Object} location - Destination location which contains latitude and longitude
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
exports.showNavigationMenu = function({ page, transportType = "d", location }) {
    if (System.OS === "iOS") {
        showNavigationMenuForIOS({ page, transportType, location });
    }
    else {
        Application.call(
            `geo:${location.latitude},${location.longitude}?q=${location.latitude},${location.longitude}&mode=${transportType}`,
            null, // data
            () => {

            }, // onSuccess
            () => {

            }, // onFailure
            true,
            global.lang.chooseNavigationApp || "Choose Navigation App" // Chooser title
        );
    }
};
