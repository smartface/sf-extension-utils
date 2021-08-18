export const MAPS_LIST: Record<MapTypes, MapBody> = {
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

export const TransportTypes = {
	DRIVING: 'd',
	WALKING: 'w',
	CYCLING: 'b'
}