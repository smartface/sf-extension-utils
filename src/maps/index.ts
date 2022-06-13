import Linking from "@smartface/native/global/linking";
import System from "@smartface/native/device/system";
import Menu from "@smartface/native/ui/menu";
import MenuItem from "@smartface/native/ui/menuitem";
import Page from "@smartface/native/ui/page";

type Location = {
	latitude: number;
	longitude: number;
};

type NavigationOptions = {
	/**
	 * @iOS
	 */
	mapType?: keyof typeof MapTypes;
	name?: string;
	location: Location;
	transportType: TransportTypes;
	/**
	 * @android
	 */
	chooserTitle?: string;
	cancelText?: string;
};

export enum MapTypes {
	APPLE_MAPS = "APPLE_MAPS",
	GOOGLE_MAPS = "GOOGLE_MAPS",
	YANDEX_MAPS = "YANDEX_MAPS",
	YANDEX_NAVIGATION = "YANDEX_NAVIGATION",
}

type MapBody = {
	NAME: string;
	SCHEME: string;
	URL: string;
	SUCCESS_TEXT: string;
	FAILURE_TEXT: string;
};

type MapOptions = {
	page: Page;
	location: Location;
	name: string;
	transportType?: keyof typeof TransportTypes;
	locationName: string;
	isNavigation: boolean;
	mapType: MapTypes | keyof typeof MapTypes;
	chooserTitle?: string;
	cancelText?: string;
};

const MapList: Record<MapTypes, MapBody> = {
	APPLE_MAPS: {
		NAME: "Apple Maps",
		URL: "http://maps.apple.com",
		SCHEME: "",
		SUCCESS_TEXT: "Apple Maps opened",
		FAILURE_TEXT: "Apple Maps couldn't be opened",
	},
	GOOGLE_MAPS: {
		NAME: "Google Maps",
		SCHEME: "comgooglemaps://",
		URL: "https://www.google.com/maps/search/",
		SUCCESS_TEXT: "Google Maps opened",
		FAILURE_TEXT: "Google Maps couldn't be opened",
	},
	YANDEX_MAPS: {
		NAME: "Yandex Maps",
		SCHEME: "yandexmaps://",
		URL: "yandexmaps://",
		SUCCESS_TEXT: "Yandex Maps opened",
		FAILURE_TEXT: "Yandex Maps couldn't be opened",
	},
	YANDEX_NAVIGATION: {
		NAME: "Yandex Navigation",
		SCHEME: "yandexnavi://",
		URL: "yandexnavi://",
		SUCCESS_TEXT: "Yandex Nagivation opened",
		FAILURE_TEXT: "Yandex Nagivation couldn't be opened",
	},
};

export enum TransportTypes {
	DRIVING = "d",
	WALKING = "w",
	CYCLING = "b",
}

type MenuStrings = {
	chooserTitle?: string;
	cancelText?: string;
};

export function showMapsMenu(options: { mapOptions: MapOptions & MenuStrings; page: Page }): Promise<any> {
	const { mapOptions, page } = options;
	return System.OS === System.OSType.IOS ? showMenuForIOS(mapOptions, page) : showMenuForAndroid(mapOptions);
}

export function showNavigationMenu(options: { navigationOptions: NavigationOptions & MenuStrings; page: Page }): Promise<any> {
	const { navigationOptions, page } = options;
	return System.OS === System.OSType.IOS ? showMenuForIOS(navigationOptions, page, true) : showMenuForAndroid(navigationOptions, true);
}

function showMenuForIOS(options: NavigationOptions | MapOptions, page: Page, isNavigation = false) {
	return new Promise<String>((resolve, reject) => {
		const menu = new Menu();
		const menuItems: MenuItem[] = [];

		const mapsOnSelected = (mapType: MapTypes) => {
			const mapOptions = getMapOptions({
				locationName: options.name || "",
				location: options.location,
				mapType,
				isNavigation,
				transportType: options.transportType,
			});
			if (!mapOptions) {
				return;
			}
			Linking.openURL({
				uriScheme: mapOptions.scheme,
				data: mapOptions.data,
				onSuccess: () => resolve(mapOptions.successText),
				onFailure: () => reject(mapOptions.errorText),
			});
		};

		const appleMapsMenuItem = new MenuItem({
			title: MapList.APPLE_MAPS.NAME,
			onSelected: () => mapsOnSelected(MapTypes.APPLE_MAPS),
		});
		const googleMapsMenuItem = new MenuItem({
			title: MapList.GOOGLE_MAPS.NAME,
			onSelected: () => mapsOnSelected(MapTypes.GOOGLE_MAPS),
		});
		const yandexMapsMenuItem = new MenuItem({
			title: MapList.YANDEX_MAPS.NAME,
			onSelected: () => mapsOnSelected(MapTypes.YANDEX_MAPS),
		});
		const cancelMenuItem = new MenuItem({
			title: options?.cancelText || "Cancel",
			ios: {
				style: MenuItem.ios.Style.CANCEL,
			},
		});

		const googleMapsAvailable = Linking.canOpenURL(MapList.GOOGLE_MAPS.SCHEME);
		const yandexMapsAvailable = Linking.canOpenURL(MapList.YANDEX_MAPS.SCHEME);

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
		menuItems.length ? menu.show(page) : mapsOnSelected(MapTypes.APPLE_MAPS);
	});
}

function showMenuForAndroid(options: MapOptions | NavigationOptions, isNavigation = false) {
	return new Promise((resolve, reject) => {
		const { latitude, longitude } = options.location;
		const locationName = options.name || "";
		const transportType = options?.transportType;
		const uriScheme = isNavigation ? `geo:${latitude},${longitude}?q=${latitude},${longitude}&mode=${transportType}` : `geo:${latitude},${longitude}?q=${encodeURIComponent(locationName)}`;
		Linking.openURL({
			uriScheme,
			chooserTitle: options?.chooserTitle || "Choose Maps App",
			onSuccess: (e) => resolve(e),
			onFailure: (e) => reject(e),
			shouldShowChooser: true,
		});
	});
}

type NewMapOptions = {
	locationName: string;
	location: {
		latitude: number;
		longitude: number;
	};
	mapType: MapTypes;
	isNavigation?: boolean;
	transportType?: keyof typeof TransportTypes | TransportTypes;
};

/**
 * @param {Object} options Options of will open map
 * @param {String} options.locationName
 * @param {Boolean} options.isNavigation
 * @param {TransportTypes} options.transportType
 * @param {MapTypes} options.mapType
 * @param {Object} options.location
 * @param {Number} options.location.latitude
 * @param {Number} options.location.longitude
 * @returns
 */
function getMapOptions(options: NewMapOptions) {
	const {
		locationName,
		isNavigation,
		transportType,
		mapType,
		location: { latitude, longitude },
	} = options;
	const isDriving = transportType === TransportTypes.DRIVING;
	return [
		{
			type: MapTypes.APPLE_MAPS,
			data: isNavigation
				? {
						daddr: `${latitude},${longitude}`,
						dirflg: isDriving ? TransportTypes.DRIVING : TransportTypes.WALKING,
				  }
				: {
						ll: `${latitude},${longitude}`,
						q: encodeURIComponent(locationName),
				  },
			scheme: MapList.APPLE_MAPS.URL,
			errorText: MapList.APPLE_MAPS.FAILURE_TEXT,
			successText: MapList.APPLE_MAPS.SUCCESS_TEXT,
		},
		{
			type: MapTypes.GOOGLE_MAPS,
			data: isNavigation
				? {
						api: "1",
						travelmode: isDriving ? "driving" : "walking",
						dir_action: "navigate",
						destination: `${latitude},${longitude}`,
				  }
				: {
						api: "1",
						query: `${latitude},${longitude}`,
						q: encodeURIComponent(locationName),
				  },
			scheme: isNavigation ? "https://www.google.com/maps/dir/" : MapList.GOOGLE_MAPS.URL,
			errorText: MapList.GOOGLE_MAPS.FAILURE_TEXT,
			successText: MapList.GOOGLE_MAPS.SUCCESS_TEXT,
		},
		{
			type: MapTypes.YANDEX_MAPS,
			data: isNavigation ? {} : { ll: `${latitude},${longitude}`, text: encodeURIComponent(locationName) },
			scheme: isNavigation ? `${MapList.YANDEX_NAVIGATION.SCHEME}build_route_on_map?lat_to=${latitude}&lon_to=${longitude}` : MapList.YANDEX_MAPS.SCHEME,
			errorText: isNavigation ? MapList.YANDEX_NAVIGATION.FAILURE_TEXT : MapList.YANDEX_MAPS.FAILURE_TEXT,
			successText: isNavigation ? MapList.YANDEX_NAVIGATION.SUCCESS_TEXT : MapList.YANDEX_MAPS.SUCCESS_TEXT,
		},
	].find((m) => m.type === mapType);
}
