/**
 * Smartface Settings module
 * @module settings
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2019
 */

import Application from "@smartface/native/application";
import System from "@smartface/native/device/system";

/**
 * Opens application settings menu
 * @static
 * @method
 * @returns {Promise}
 * @example
 * import { openApplicationSettings } from '@smartface/extension-utils/lib/settings';
 * openApplicationSettings();
 *
 */
export function openApplicationSettings(): Promise<void> {
	return new Promise((resolve, reject) => {
		const options = {
			uriScheme:
				System.OS === System.OSType.IOS
					? "app-settings:"
					: "package:" + Application.android.packageName,
			onSuccess: () => resolve(),
			onFailure: () => reject(),
			action:
				System.OS === System.OSType.ANDROID
					? "android.settings.APPLICATION_DETAILS_SETTINGS"
					: "",
		};
		Application.call(options);
	});
}
