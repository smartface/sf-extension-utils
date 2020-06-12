/**
 * Smartface Android Permission module
 * @module permission
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2020
 */

import Application = require('sf-core/application');
/**
 * Run-time permission requests for Android if needed. iOS automatically succeeds.
 * Permission request numbers starts from 2000 and incremented on each requestPermission
 * @function permission:getPermission
 * @param {Application.android.Permissions} permission permission to get
 * @param {string} permissionText text to show when permission cannot be granted
 * @static
 * @public
 * @see {@link http://ref.smartface.io/#!/api/Application.android.Permissions|Permission Types}
 * @see {@link https://developer.smartface.io/docs/application-permission-management|Application Permission Management}
 * @example
 * import permissionUtil from 'sf-extension-utils/lib/permission';
 * permissionUtil.getPermission(Application.Android.Permissions.READ_CONTACTS, 'Please go to the settings and grant permission')
 *     .then(() => {
 *         console.info('Permission granted');
 *     })
 *     .catch((reason) => {
 *         console.info('Permission rejected');
 *     });
 */

export function getPermission(permission: Application.android.Permissions, permissionText: string): Promise<any>;
export const PERMISSION_STATUS: {
    GRANTED: string,
    DENIED: string,
    NEVER_ASK_AGAIN: string
};
