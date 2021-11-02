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

import System from "@smartface/native/device/system";
import Page from "@smartface/native/ui/page";
import Application from "@smartface/native/application";
import Menu from "@smartface/native/ui/menu";
import MenuItem from "@smartface/native/ui/menuitem";
import { MAPS_LIST, TransportTypes } from "../shared";

export { TransportTypes } from "../shared";
/**
 * Prompts a menu to choose which navigation app to handle the location.
 * It sets the starting point to your current location, if the permission is granted.
 * @example
 * ```
 * import { showNavigationMenu } from '@smartface/extension-utils/lib/navigation';
 * navigation.showNavigationMenu({
 *      page,
 *      transportType: ,
 *      location: {
 *          latitude: 37.4488259,
 *          longitude: -122.1600047
 *      }
 *  });
 *```
 */
export function showNavigationMenu(options: MapsOptions): Promise<string> {
	return System.OS === System.OSType.IOS
		? showNavigationMenuForIOS(options)
		: showNavigationMenuForAndroid(options);
}
export default {
	showNavigationMenu,
	TransportTypes,
};
const showNavigationMenuForIOS = (function() {
	let menu: Menu;
	return function(options: MapsOptions): Promise<string> {
		return new Promise((resolve, reject) => {
			// Use from cache if necessary
			menu = menu || createMapsMenuForIOS();

			const { page, location, name } = options;
			const locationName = name || "";
			const isDriving = options.transportType === "d";

			const appleMapsOnSelected = () => {
				Application.call({
					uriScheme: MAPS_LIST.APPLE_MAPS.URL,
					data: {
						daddr: `${location.latitude},${location.longitude}`,
						dirflg: isDriving ? "h" : "w",
					},
					onSuccess: () => resolve(MAPS_LIST.APPLE_MAPS.SUCCESS_TEXT),
					onFailure: () => reject(MAPS_LIST.APPLE_MAPS.FAILURE_TEXT),
				});
			};
			menu.items.forEach((item) => {
				if (item.title === MAPS_LIST.APPLE_MAPS.NAME) {
					item.onSelected = appleMapsOnSelected;
				} else if (item.title === MAPS_LIST.GOOGLE_MAPS.NAME) {
					item.onSelected = () => {
						Application.call({
							uriScheme: "https://www.google.com/maps/dir/",
							data: {
								api: "1",
								travelmode: isDriving ? "driving" : "walking",
								dir_action: "navigate",
								destination: `${location.latitude},${location.longitude}`,
							},
							onSuccess: () => resolve(MAPS_LIST.GOOGLE_MAPS.SUCCESS_TEXT),
							onFailure: () => reject(MAPS_LIST.GOOGLE_MAPS.FAILURE_TEXT),
						});
					};
				} else if (item.title === MAPS_LIST.YANDEX_MAPS.NAME) {
					item.onSelected = () => {
						Application.call({
							uriScheme: `${MAPS_LIST.YANDEX_NAVIGATION.SCHEME}build_route_on_map?lat_to=${location.latitude}&lon_to=${location.longitude}`,
							data: {},
							onSuccess: () =>
								resolve(MAPS_LIST.YANDEX_NAVIGATION.SUCCESS_TEXT),
							onFailure: () => reject(MAPS_LIST.YANDEX_NAVIGATION.FAILURE_TEXT),
						});
					};
				} else if (item.ios.style === MenuItem.ios.Style.CANCEL) {
					item.onSelected = () => reject("User Cancelled the choice");
				}
			});
			const appleMapsItem = menu.items.find(
				(item) => item.title === MAPS_LIST.APPLE_MAPS.NAME
			);
			menu.items.length ? menu.show(page) : appleMapsOnSelected();
		});
	};
})();

async function showNavigationMenuForAndroid(
	opts: MapsOptions = {
		name: "",
		location: {
			latitude: 0,
			longitude: 0,
		},
		page: new Page(),
		transportType: "",
	}
): Promise<string> {
	return new Promise((resolve, reject) => {
		const { latitude, longitude } = opts.location;
		Application.call({
			uriScheme: `geo:${latitude},${longitude}?q=${latitude},${longitude}&mode=${opts.transportType}`,
			//@ts-ignore
			chooserTitle: global.lang.chooseMapsApp || "Choose Maps App",
			//@ts-ignore
			onSuccess: (e) => resolve(e),
			//@ts-ignore
			onFailure: (e) => reject(e),
			isShowChooser: true,
		});
	});
}

function createMapsMenuForIOS() {
	const menu = new Menu();
	const menuItems: MenuItem[] = [];
	const googleMapsAvailable = Application.ios.canOpenUrl(
		MAPS_LIST.GOOGLE_MAPS.SCHEME
	);
	const yandexMapsAvailable = Application.ios.canOpenUrl(
		MAPS_LIST.YANDEX_NAVIGATION.SCHEME
	);

	const appleMapsMenuItem = new MenuItem({
		title: MAPS_LIST.APPLE_MAPS.NAME,
	});
	const googleMapsMenuItem = new MenuItem({
		title: MAPS_LIST.GOOGLE_MAPS.NAME,
	});
	const yandexMapsMenuItem = new MenuItem({
		title: MAPS_LIST.YANDEX_NAVIGATION.NAME,
	});
	const cancelMenuItem = new MenuItem({
		//@ts-ignore
		title: global.lang.cancel || "Cancel",
		ios: {
			style: MenuItem.ios.Style.CANCEL,
		},
	});
	// Google Maps
	if (googleMapsAvailable) {
		menuItems.push(googleMapsMenuItem);
	}
	// Yandex Maps
	if (yandexMapsAvailable) {
		menuItems.push(yandexMapsMenuItem);
	}
	if (googleMapsAvailable || yandexMapsAvailable) {
		menuItems.push(appleMapsMenuItem);
		menuItems.push(cancelMenuItem);
	}
	menu.items = menuItems;
	return menu;
}
