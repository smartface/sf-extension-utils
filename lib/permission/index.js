/* eslint-disable import/no-unresolved */

/**
 * Smartface Android Permission module
 * @module permission
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2020
 */

const System = require('sf-core/device/system');
const Application = require('sf-core/application');
const AlertView = require('sf-core/ui/alertview');
const { openApplicationSettings } = require('sf-extension-utils/lib/settings');
const langChecker = require('../base/langchecker')('permission');

langChecker.check(['permissionRequiredTitle']);

let lastRequestPermissionCode = 2000;

const PERMISSION_STATUS = {
    GRANTED: 'GRANTED',
    DENIED: 'DENIED',
    NEVER_ASK_AGAIN: 'NEVER_ASK_AGAIN'
};

function showAlertAndRedirectToSettings(permissionText) {
    const alertView = alert({
        title: global.lang.permissionRequiredTitle || 'Permissions required',
        message: permissionText || 'Please grant related permissions for application to work properly',
        buttons: [{
            text: global.lang.goToSettings,
            type: AlertView.Android.ButtonType.POSITIVE,
            onClick: () => {
                openApplicationSettings();
            }
        }, {
            text: global.lang.cancel,
            type: AlertView.Android.ButtonType.NEGATIVE,
            onClick: () => {
                alertView.dismiss();
            }
        }]
    });
}

/**
 * Run-time permission requests for Android if needed. iOS automatically succeeds.
 * Permission request numbers starts from 2000 and incremented on each requestPermission
 * @function permission:getPermission
 * @param {Application.android.Permissions} permission permission to get
 * @param {string} permissionText text to show when permission cannot be granted
 * @returns {Promise}
 * @static
 * @public
 * @see {@link http://ref.smartface.io/#!/api/Application.android.Permissions|Permission Types}
 * @see {@link https://developer.smartface.io/docs/application-permission-management|Application Permission Management}
 * @example
 * const permissionUtil = require('sf-extension-utils/lib/permission');
 * permissionUtil.getPermission(Application.Android.Permissions.READ_CONTACTS, 'Please go to the settings and grant permission')
 *     .then(() => {
 *         console.info('Permission granted');
 *     })
 *     .catch((reason) => {
 *         console.info('Permission rejected');
 *     });
 */

function getPermission(permission, permissionText = '') {
    return new Promise((resolve, reject) => {
        if (System.OS === 'iOS') {
            // Hardcoded logic for iOS to pass
            resolve();
        } else {
            const requestPermissionCode = lastRequestPermissionCode++;
            const prevPermissionRationale = Application.android
                .shouldShowRequestPermissionRationale(permission);
            if (Application.android.checkPermission(permission)) {
                resolve();
            } else {
                Application.android.onRequestPermissionsResult = (e) => {
                    const currentPermissionRationale = Application.android
                        .shouldShowRequestPermissionRationale(permission);
                    if (e.requestCode === requestPermissionCode && e.result) {
                        resolve(PERMISSION_STATUS.GRANTED);
                    } else if (!e.result && !currentPermissionRationale && !prevPermissionRationale) {
                        setTimeout(() => showAlertAndRedirectToSettings(permissionText), 500);
                        reject(PERMISSION_STATUS.NEVER_ASK_AGAIN);
                    } else {
                        reject(PERMISSION_STATUS.DENIED);
                    }
                };
                Application.android.requestPermissions(requestPermissionCode, permission);
            }
        }
    });
}

exports.getPermission = getPermission;
exports.PERMISSION_STATUS = PERMISSION_STATUS;
