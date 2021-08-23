/**
 * @module map
 * @type {Object}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 *
 * Map utility to cover the most popular map applications on both platforms.
 * It will pin the given location in the chosen map app
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

import Application from "@smartface/native/application";
import System from "@smartface/native/device/system";
import Menu from "@smartface/native/ui/menu";
import MenuItem from "@smartface/native/ui/menuitem";
import Page from "@smartface/native/ui/page";
import { MAPS_LIST } from '../shared';

/**
 * Prompts a menu to choose which navigation app to handle the location.
 * It sets the starting point to your current location, if the permission is granted.
 * @function
 * @example
 * ```
 * import { showMapsMenu } from "@smartface/extension-utils/lib/maps";
 * showMapsMenu({
 *      page,
 *      location: {
 *          latitude: 37.4488259,
 *          longitude: -122.1600047
 *      },
 *      name: "Smartface Inc."
 *  });
 *```
 */
export function showMapsMenu(options: MapsOptions): Promise<string> {
	return System.OS === System.OSType.IOS
		? showMapsMenuForIOS(options)
		: showMapsForAndroid(options);
}

const showMapsMenuForIOS = (function() {
	let menu: Menu;
	return function(options: MapsOptions): Promise<string> {
		return new Promise((resolve, reject) => {
			// Use from cache if necessary
			menu = menu || createMapsMenuForIOS();

			const { page, location, name } = options;
			const locationName = name || "";
			menu.items.forEach((item) => {
				if (item.title === MAPS_LIST.APPLE_MAPS.NAME) {
					Application.call({
						uriScheme: MAPS_LIST.APPLE_MAPS.URL,
						data: {
							ll: `${location.latitude},${location.longitude}`,
							q: encodeURIComponent(locationName),
						},
						onSuccess: () => resolve(MAPS_LIST.APPLE_MAPS.SUCCESS_TEXT),
						onFailure: () => reject(MAPS_LIST.APPLE_MAPS.FAILURE_TEXT),
					});
				} else if (item.title === MAPS_LIST.GOOGLE_MAPS.NAME) {
					item.onSelected = () => {
						Application.call({
							uriScheme: MAPS_LIST.GOOGLE_MAPS.URL,
							data: {
								api: "1",
								query: `${location.latitude},${location.longitude}`,
								q: encodeURIComponent(locationName),
							},
              onSuccess: () => resolve(MAPS_LIST.GOOGLE_MAPS.SUCCESS_TEXT),
              onFailure: () => reject(MAPS_LIST.GOOGLE_MAPS.FAILURE_TEXT),
						});
					};
				} else if (item.title === MAPS_LIST.YANDEX_MAPS.NAME) {
          item.onSelected = () => {
						Application.call({
							uriScheme: MAPS_LIST.YANDEX_MAPS.SCHEME,
              data: {
                ll: `${location.latitude},${location.longitude}`,
                text: encodeURIComponent(locationName),
              },
              onSuccess: () => resolve(MAPS_LIST.YANDEX_MAPS.SUCCESS_TEXT),
              onFailure: () => reject(MAPS_LIST.YANDEX_MAPS.FAILURE_TEXT),
						});
          }
        } else if (item.ios.style === MenuItem.ios.Style.CANCEL) {
          item.onSelected = () => reject('User Cancelled the choice');
        }
			});
      const appleMapsItem = menu.items.find((item) => item.title === MAPS_LIST.APPLE_MAPS.NAME);
			menu.items.length ? menu.show(page) : appleMapsItem?.onSelected();
		});
	};
})();

async function showMapsForAndroid(
	opts: MapsOptions = {
		name: "",
		location: {
			latitude: 0,
			longitude: 0,
		},
    page: new Page()
	}
): Promise<string> {
	return new Promise((resolve, reject) => {
		const { latitude, longitude } = opts.location;
		Application.call({
			uriScheme: `geo:${latitude},${longitude}?q=${encodeURIComponent(
				opts.name
			)}`,
			action: "",
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
	const menuItems = [];
	const googleMapsAvailable = Application.ios.canOpenUrl(
		MAPS_LIST.GOOGLE_MAPS.SCHEME
	);
	const yandexMapsAvailable = Application.ios.canOpenUrl(
		MAPS_LIST.YANDEX_MAPS.SCHEME
	);

	const appleMapsMenuItem = new MenuItem({
		title: MAPS_LIST.APPLE_MAPS.NAME,
	});
	const googleMapsMenuItem = new MenuItem({
		title: MAPS_LIST.GOOGLE_MAPS.NAME,
	});
	const yandexMapsMenuItem = new MenuItem({
		title: MAPS_LIST.YANDEX_MAPS.NAME,
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
