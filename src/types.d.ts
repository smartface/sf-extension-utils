declare type Location = {
	latitude: number;
	longitude: number;
};

declare enum MapTypes {
	APPLE_MAPS = "APPLE_MAPS",
	GOOGLE_MAPS = "GOOGLE_MAPS",
	YANDEX_MAPS = "YANDEX_MAPS",
	YANDEX_NAVIGATION = "YANDEX_NAVIGATION"
}

declare type MapBody = {
	NAME: string;
	SCHEME: string;
	URL: string;
	SUCCESS_TEXT: string;
	FAILURE_TEXT: string;
};

type MapsOptions = { 
  page: Page;
  location: Location; 
  name: string;
	transportType?: string;
}