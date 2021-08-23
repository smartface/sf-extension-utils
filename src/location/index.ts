/* eslint-disable prefer-promise-reject-errors */
import Location from "@smartface/native/device/location";
import Application from "@smartface/native/application";
import System from "@smartface/native/device/system";
import { getPermission, IOS_PERMISSIONS } from "permission";

/**
 * Smartface Location module
 * @module location
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @author Alim Öncül <alim.oncul@smartface.io>
 * @copyright Smartface 2021
 */

/**
 * Gets location latitude and longitude. Handles permissions by itself.
 * @example
 * ```
 * import { location } from '@smartface/extension-utils/lib/location';
 *
 * location.getLocation()
 *     .then(location => {
 *         let requestOptions = {
 *             'url': 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.latitude + ',' + location.longitude + '&sensor=true',
 *             'method': 'GET'
 *         };
 *     })
 *     .catch(e => {
 *         // e parameter can be one of these values:
 *         // "RESTRICTED" / iOS specific, this is returned if authorization status is Location.iOS.AuthorizationStatus.RESTRICTED
 *         // "OTHER" / Android specific, this is returned if the operation failed with no more detailed information
 *         // "DENIED" / Returned for all other cases
 *         console.log("Location cannot be retrieved");
 *     });
 * ```
 */
export async function getLocation(
	callback?: (...args: any) => void,
	showSettingsAlert = true,
	permissionText?: string,
	permissionTitle?: string
): Promise<MapsOptions['location']> {
	const getLocationPromise = async () => {
		await getPermission({
			androidPermission: Application.Android.Permissions.ACCESS_FINE_LOCATION,
			iosPermission: IOS_PERMISSIONS.LOCATION,
			showSettingsAlert,
			permissionText: "",
			permissionTitle: "",
		});
		return System.OS === System.OSType.IOS
		? getLocationAction()
		: getLocationActionForAndroid();
	}
	
	if (callback) {
		try {
			const location = await getLocationPromise();
			callback(null, location);
		} catch (e) {
			callback(e);
		} finally {
			return getLocationPromise();
		}
	} else {
		return await getLocationPromise();
	}
}

function getLocationAction(): Promise<MapsOptions['location']> {
	return new Promise((resolve) => {
		Location.start(Location.Android.Priority.HIGH_ACCURACY, 1000);
		Location.onLocationChanged = (location) => {
			Location.onLocationChanged = () => {};
			Location.stop();
			resolve(location);
		};
	});
}

function getLocationActionForAndroid(): Promise<MapsOptions['location']> {
	return new Promise((resolve, reject) => {
		//@ts-ignore
		Location.android.checkSettings({
			onSuccess: () => {
				getLocationAction().then(resolve);
			},
			onFailure: (e: { statusCode: Location.Android.SettingsStatusCodes }) => {
				if (e.statusCode === Location.Android.SettingsStatusCodes.DENIED) {
					reject("DENIED");
				} else {
					reject("OTHER");
				}
			},
		});
	});
}
