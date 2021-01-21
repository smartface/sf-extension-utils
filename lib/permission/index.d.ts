/**
 * Smartface Android & Partly iOS Permission module
 * @module permission
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Alim Öncül <alim.oncul@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 */

import Application = require('sf-core/application');
/**
 * Run-time permission requests for Android if needed. iOS only supports camera, others automatically succeeds.
 * Permission request numbers starts from 2000 and incremented on each requestPermission
 * @function permission:getPermission
 * @param {Object} opts - Options for the module
 * @param {Application.android.Permissions} opts.androidPermission - Android permission to get
 * @param {string} opts.iosPermission [opts.iosPermission] - iOS permission to get
 * @param {string} opts.permissionText - Text to show when permission cannot be granted
 * @static
 * @public
 * @see {@link http://ref.smartface.io/#!/api/Application.android.Permissions|Permission Types}
 * @see {@link https://developer.smartface.io/docs/application-permission-management|Application Permission Management}
 * @example
 * import permissionUtil from 'sf-extension-utils/lib/permission';
 * permissionUtil.getPermission({
 *         androidPermission: Application.Android.Permissions.CAMERA,
 *         iosPermission: permissionUtil.IOS_PERMISSIONS.CAMERA,
 *         permissionText: 'Please go to the settings and grant permission'
 *     })
 *     .then(() => {
 *         console.info('Permission granted');
 *     })
 *     .catch((reason) => {
 *         console.info('Permission rejected');
 *     });
 */

export function getPermission({androidPermission, permissionText, iosPermission}: {
    androidPermission: Application.android.Permissions, 
    permissionText: string, 
    iosPermission?: string
}): Promise<any>;
export const PERMISSION_STATUS: {
    GRANTED: string,
    DENIED: string,
    NEVER_ASK_AGAIN: string
};
export const IOS_PERMISSIONS: {
    CAMERA: "CAMERA"
}
