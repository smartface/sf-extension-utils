/**
 * Smartface Android & Partly iOS Permission module
 * @module permission
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Alim Öncül <alim.oncul@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 */

import Application from "@smartface/native/application";
import System from "@smartface/native/device/system";
import AlertView from "@smartface/native/ui/alertview";
import Multimedia from "@smartface/native/device/multimedia";
import alert from "../base/alert";
import { openApplicationSettings } from "../settings";
import Location from "@smartface/native/device/location";

let lastRequestPermissionCode = 2000;
const ALERT_TIMEOUT = 500;

/**
 * Run-time permission requests for Android if needed. iOS only supports camera, others automatically succeeds.
 * Permission request numbers starts from 2000 and incremented on each requestPermission
 * @example
 * ```
 * import permissionUtil from '@smartface/extension-utils/lib/permission';
 * permissionUtil.getPermission({
 *         androidPermission: Application.Android.Permissions.CAMERA,
 *         iosPermission: permissionUtil.IOS_PERMISSIONS.CAMERA,
 *         permissionText: 'Please go to the settings and grant permission',
 *         permissionTitle: 'Info'
 *     })
 *     .then(() => {
 *         console.info('Permission granted');
 *     })
 *     .catch((reason) => {
 *         console.info('Permission rejected');
 *     });
 * ```
 */

export async function getPermission(
	opts: {
		permissionTitle?: string;
		androidPermission: keyof typeof Application.Android.Permissions;
		permissionText: string;
		iosPermission?: keyof typeof IOS_PERMISSIONS;
		showSettingsAlert?: boolean;
	} = {
		permissionTitle: "",
		permissionText: "",
		//@ts-ignore
		androidPermission: undefined,
		iosPermission: undefined,
		showSettingsAlert: true,
	}
): Promise<string> {
	return new Promise((resolve, reject) => {
		if (System.OS === System.OSType.IOS) {
			if (opts.iosPermission === IOS_PERMISSIONS.CAMERA) {
				if (
					Multimedia.ios.getCameraAuthorizationStatus() !==
					Multimedia.iOS.CameraAuthorizationStatus.AUTHORIZED
				) {
					Multimedia.ios.requestCameraAuthorization((status) => {
						//@ts-ignore
						__SF_Dispatch.mainAsync(() => {
							if (status) {
								resolve(PERMISSION_STATUS.GRANTED);
							} else {
								setTimeout(() => {
									if (opts.showSettingsAlert) {
										alertWrapper(opts.permissionText, opts.permissionTitle);
									}
								}, ALERT_TIMEOUT);
								reject(PERMISSION_STATUS.DENIED);
							}
						});
					});
				} else {
					resolve(PERMISSION_STATUS.GRANTED);
				}
			} else if (opts.iosPermission === IOS_PERMISSIONS.LOCATION) {
				//@ts-ignore
				const authorizationStatus = Location.ios.getAuthorizationStatus();
				if (
					//@ts-ignore
					authorizationStatus === Location.iOS.AuthorizationStatus.AUTHORIZED
				) {
					resolve(PERMISSION_STATUS.GRANTED);
				} else if (
					//@ts-ignore
					authorizationStatus === Location.iOS.AuthorizationStatus.DENIED
				) {
					setTimeout(() => {
						if (opts.showSettingsAlert) {
							alertWrapper(opts.permissionText, opts.permissionTitle);
						}
					}, ALERT_TIMEOUT);
					reject(PERMISSION_STATUS.DENIED);
				} else if (
					//@ts-ignore
					authorizationStatus === Location.iOS.AuthorizationStatus.NOTDETERMINED
				) {
					Location.start(Location.Android.Priority.HIGH_ACCURACY, 1000);
					//@ts-ignore
					Location.ios.onChangeAuthorizationStatus = (permissionGranted) => {
						//@ts-ignore
						Location.ios.onChangeAuthorizationStatus = () => {};
						if (permissionGranted) {
							resolve(PERMISSION_STATUS.GRANTED);
						} else {
							setTimeout(() => {
								if (opts.showSettingsAlert) {
									alertWrapper(opts.permissionText, opts.permissionTitle);
								}
							}, ALERT_TIMEOUT);
							reject(PERMISSION_STATUS.DENIED);
						}
					};
				} else if (
					//@ts-ignore
					authorizationStatus === Location.iOS.AuthorizationStatus.RESTRICTED
				) {
					reject(PERMISSION_STATUS.NEVER_ASK_AGAIN);
				}
			} else {
				// Hardcoded logic for iOS to pass
				resolve('');
			}
		} else {
			const requestPermissionCode = lastRequestPermissionCode++;
			//@ts-ignore
			const prevPermissionRationale = Application.android.shouldShowRequestPermissionRationale(
				opts.androidPermission
			);
			if (Application.android.checkPermission(opts.androidPermission)) {
				resolve('');
			} else {
				Application.android.onRequestPermissionsResult = (e) => {
					//@ts-ignore
					const currentPermissionRationale = Application.android.shouldShowRequestPermissionRationale(
						opts.androidPermission
					);
					if (e.requestCode === requestPermissionCode && e.result) {
						resolve(PERMISSION_STATUS.GRANTED);
					} else if (
						!e.result &&
						!currentPermissionRationale &&
						!prevPermissionRationale
					) {
						setTimeout(() => {
							if (opts.showSettingsAlert) {
								alertWrapper(opts.permissionText, opts.permissionTitle);
							}
						}, ALERT_TIMEOUT);
						reject(PERMISSION_STATUS.NEVER_ASK_AGAIN);
					} else {
						reject(PERMISSION_STATUS.DENIED);
					}
				};
				Application.android.requestPermissions(
					requestPermissionCode,
					opts.androidPermission
				);
			}
		}
	});
}

export const PERMISSION_STATUS: {
	GRANTED: string;
	DENIED: string;
	NEVER_ASK_AGAIN: string;
} = {
	GRANTED: "GRANTED",
	DENIED: "DENIED",
	NEVER_ASK_AGAIN: "NEVER_ASK_AGAIN",
};

export enum IOS_PERMISSIONS {
	CAMERA = "CAMERA",
	LOCATION = "LOCATION",
}

function alertWrapper(permissionText = "", permissionTitle = "") {
	if (System.OS === "iOS") {
		//@ts-ignore
		__SF_Dispatch.mainAsync(() => {
			showAlertAndRedirectToSettings(permissionText, permissionTitle);
		});
	} else {
		showAlertAndRedirectToSettings(permissionText, permissionTitle);
	}
}

function showAlertAndRedirectToSettings(
	permissionText: string,
	permissionTitle: string
) {
	const alertView: AlertView = alert({
		title:
			permissionTitle ||
			//@ts-ignore
			global.lang.permissionRequiredTitle ||
			"Permissions required",
		//@ts-ignore
		message:
			permissionText ||
			//@ts-ignore
			global.lang.permissionRequiredMessage ||
			"Please grant related permissions for application to work properly",
		buttons: [
			{
				//@ts-ignore
				text: global.lang.goToSettings,
				type: AlertView.Android.ButtonType.POSITIVE,
				onClick: () => openApplicationSettings(),
			},
			{
				//@ts-ignore
				text: global.lang.cancel,
				type: AlertView.Android.ButtonType.NEGATIVE,
				onClick: () => alertView.dismiss(),
			},
		],
	});
}
