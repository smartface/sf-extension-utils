/**
 * Navigation utility to cover the most popular applications on iOS
 * @module navigation
 * @type {function}
 * @author Ozcan Ovunc <furkan.arabaci@smartface.io>
 * @copyright Smartface 2018
 */
const System = require('sf-core/device/system');
const Application = require("sf-core/application");
const Menu = require("sf-core/ui/menu");
const MenuItem = require("sf-core/ui/menuitem");
const langChecker = require("./base/langchecker")("navigation");

langChecker.check(["cancel", "chooseNavigationApp"]);

var showNavigationMenuForIOS = (function() {
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
    menu.appleMapsMenuItem = appleMapsMenuItem;
    menuItems.push(appleMapsMenuItem);

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
 * @param {string} transportType - your way of travel, driving or walking. Accepted paramters = "d", "w"
 * @param {Object} location - Location data which contains lat and lng
 * @example
 * const navigation = require("sf-extension-utils/lib/navigation");
 * navigation.showNavigationMenu({
 *      page,
 *      transportType: "d",
 *      location: {
 *          latitude: 55.758192,
 *          longitude: 37.642817
 *      }
 *  });
 * 
 */
exports.showNavigationMenu = function({ page, transportType = "d", location }) {
    if (System.OS === "iOS") {
        showNavigationMenuForIOS({ page, transportType, location });
    }
    else {

        // TODO: Handle transportType
        Application.call(
            `geo:${location.latitude},${location.longitude}?q=${location.latitude},${location.longitude}`,
            null, // data
            _ => _, // onSuccess
            _ => _, // onFailure
            true, // Show chooser
            global.lang.chooseNavigationApp || "Choose Navigation App" // Chooser title
        );
    }
}
