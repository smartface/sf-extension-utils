import Linking from '@smartface/native/application/linking';
import { MapList, MapTypes } from '@smartface/native/application/linking/shared/map';
import { MapOptions, NavigationOptions } from '@smartface/native/application/maps'
import { getMapOptions } from '@smartface/native/application/maps/maps';
import System from '@smartface/native/device/system';
import Menu from "@smartface/native/ui/menu";
import MenuItem from "@smartface/native/ui/menuitem";
import Page from '@smartface/native/ui/page';

export function showMapsMenu(options: { mapOptions: MapOptions, page: Page }): Promise<any> {
  const { mapOptions, page } = options;
  return System.OS === System.OSType.IOS ? showMenuForIOS(mapOptions, page) : showMenuForAndroid(mapOptions);
}

export function showNavigationMenu(options: { navigationOptions: NavigationOptions, page: Page }): Promise<any> {
  const { navigationOptions, page } = options;
  return System.OS === System.OSType.IOS ? showMenuForIOS(navigationOptions, page) : showMenuForAndroid(navigationOptions);
}

function showMenuForIOS(options: NavigationOptions | MapOptions, page: Page, isNavigation = false) {
  return new Promise<String>((resolve, reject) => {
    const menu = new Menu();
    const menuItems: MenuItem[] = [];

    const mapsOnSelected = (mapType: MapTypes) => {
      const mapOptions = getMapOptions({
        locationName: options.name,
        location: options.location,
        mapType,
        isNavigation,
        // @ts-ignore
        transportType: options.transportType
      });
      Linking.openURL({
        uriScheme: mapOptions.scheme,
        data: mapOptions.data,
        onSuccess: () => resolve(mapOptions.successText),
        onFailure: () => reject(mapOptions.errorText)
      });
    }

    const appleMapsMenuItem = new MenuItem({
      title: MapList.APPLE_MAPS.NAME,
      onSelected: () => mapsOnSelected(MapTypes.APPLE_MAPS)
    });
    const googleMapsMenuItem = new MenuItem({
      title: MapList.GOOGLE_MAPS.NAME,
      onSelected: () => mapsOnSelected(MapTypes.GOOGLE_MAPS)
    });
    const yandexMapsMenuItem = new MenuItem({
      title: MapList.YANDEX_MAPS.NAME,
      onSelected: () => mapsOnSelected(MapTypes.YANDEX_MAPS)
    });
    const cancelMenuItem = new MenuItem({
      //@ts-ignore
      title: global.lang.cancel || "Cancel",
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
    const locationName = options.name || '';
    // @ts-ignore
    const transportType = options?.transportType;
    const uriScheme = isNavigation
      ? `geo:${latitude},${longitude}?q=${latitude},${longitude}&mode=${transportType}`
      : `geo:${latitude},${longitude}?q=${encodeURIComponent(locationName)}`;
    Linking.openURL({
      uriScheme,
      chooserTitle: global.lang.chooseMapsApp || "Choose Maps App",
      onSuccess: (e) => resolve(e),
      onFailure: (e) => reject(e),
      isShowChooser: true
    });
  });
}