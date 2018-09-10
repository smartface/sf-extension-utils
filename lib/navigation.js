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
            menu.appleMapsMenuItem.onSelected = _ => {
                Application.call("http://maps.apple.com/", {
                    "daddr": `${location.latitude},${location.longitude}`,
                    "dirflg": isDriving ? "h" : "w"
                });
            };
        }
        if (menu.googleMapsMenuItem) {
            menu.googleMapsMenuItem.onSelected = _ => {
                Application.call("https://www.google.com/maps/dir/", {
                    "api": "1",
                    "travelmode": isDriving ? "driving" : "walking",
                    "dir_action": "navigate",
                    "destination": `${location.latitude},${location.longitude}`,
                });
            };
        }
        menu.show(page);
    };
})();

function createNavigationMenuForIOS() {
    var menu = new Menu();
    var menuItems = [];
    var googleMapsAvailable = Application.ios.canOpenUrl("comgooglemaps://");

    var appleMapsMenuItem = new MenuItem({
        title: "Apple Maps"
    });
    var googleMapsMenuItem = new MenuItem({
        title: "Google Maps"
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

    menuItems.push(cancelMenuItem);
    menu.items = menuItems;
    return menu;
}

function showNavigationMenu({ page, transportType = "d", location }) {
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

exports = showNavigationMenu;
