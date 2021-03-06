/* eslint-disable import/no-unresolved */

/**
 * Smartface Android & Partly iOS Permission module
 * @module permission
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Alim Öncül <alim.oncul@smartface.io>
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @copyright Smartface 2021
 */

const System = require('sf-core/device/system');
const Application = require('sf-core/application');
const AlertView = require('sf-core/ui/alertview');
const Multimedia = require('sf-core/device/multimedia');
const Location = require('sf-core/device/location');
const { openApplicationSettings } = require('sf-extension-utils/lib/settings');
const langChecker = require('../base/langchecker')('permission');

langChecker.check(['permissionRequiredTitle', 'permissionRequiredMessage']);

let lastRequestPermissionCode = 2000;
const ALERT_TIMEOUT = 500;

const PERMISSION_STATUS = {
    GRANTED: 'GRANTED',
    DENIED: 'DENIED',
    NEVER_ASK_AGAIN: 'NEVER_ASK_AGAIN'
};

const IOS_PERMISSIONS = {
    CAMERA: 'CAMERA',
    LOCATION: 'LOCATION'
};

function alertWrapper(permissionText, permissionTitle) {
    if (System.OS === 'iOS') {
        __SF_Dispatch.mainAsync(() => {
            showAlertAndRedirectToSettings(permissionText, permissionTitle);
        });
    } else {
        showAlertAndRedirectToSettings(permissionText, permissionTitle);
    }
}

function showAlertAndRedirectToSettings(permissionText, permissionTitle) {
    const alertView = alert({
        title: permissionTitle || global.lang.permissionRequiredTitle || 'Permissions required',
        message: permissionText || global.lang.permissionRequiredMessage || 'Please grant related permissions for application to work properly',
        buttons: [{
            text: global.lang.goToSettings,
            type: AlertView.Android.ButtonType.POSITIVE,
            onClick: () => openApplicationSettings()
        }, {
            text: global.lang.cancel,
            type: AlertView.Android.ButtonType.NEGATIVE,
            onClick: () => alertView.dismiss()
        }]
    });
}

/**
 * Run-time permission requests for Android if needed. iOS only supports camera, others automatically succeeds.
 * Permission request numbers starts from 2000 and incremented on each requestPermission
 * @function permission:getPermission
 * @param {Object} opts - Options for the module
 * @param {Application.android.Permissions} opts.androidPermission - Android permission to get
 * @param {string} opts.iosPermission [opts.iosPermission] - iOS permission to get
 * @param {string} opts.permissionText - Text to show when permission cannot be granted
 * @param {string} opts.permissionTitle - Title to show when permission cannot be granted
 * @param {boolean} opts.showSettingsAlert - toggle to show the alert to navigate to settings when permission is denied
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

function getPermission({
    androidPermission,
    permissionTitle = '',
    permissionText = '',
    iosPermission,
    showSettingsAlert = true
}) {
    return new Promise((resolve, reject) => {
        if (System.OS === 'iOS') {
            if (iosPermission === IOS_PERMISSIONS.CAMERA) {
                if (Multimedia.ios.getCameraAuthorizationStatus()
                !== Multimedia.iOS.CameraAuthorizationStatus.AUTHORIZED) {
                    Multimedia.ios.requestCameraAuthorization((status) => {
                        __SF_Dispatch.mainAsync(() => {
                            if (status) {
                                resolve(PERMISSION_STATUS.GRANTED);
                            } else {
                                setTimeout(() => showSettingsAlert && alertWrapper(permissionText, permissionTitle), ALERT_TIMEOUT);
                                reject(PERMISSION_STATUS.DENIED);
                            }
                        });
                    });
                } else {
                    resolve(PERMISSION_STATUS.GRANTED);
                }
            } else if (iosPermission === IOS_PERMISSIONS.LOCATION) {
                const authorizationStatus = Location.ios.getAuthorizationStatus();
                if (authorizationStatus === Location.iOS.AuthorizationStatus.AUTHORIZED) {
                    resolve(PERMISSION_STATUS.GRANTED);
                } else if (authorizationStatus === Location.iOS.AuthorizationStatus.DENIED) {
                    setTimeout(() => showSettingsAlert && alertWrapper(permissionText, permissionTitle), ALERT_TIMEOUT);
                    reject(PERMISSION_STATUS.DENIED);
                } else if (authorizationStatus === Location.iOS.AuthorizationStatus.NOTDETERMINED) {
                    Location.start();
                    Location.ios.onChangeAuthorizationStatus = (permissionGranted) => {
                        Location.ios.onChangeAuthorizationStatus = () => {};
                        if (permissionGranted) {
                            resolve(PERMISSION_STATUS.GRANTED);
                        } else {
                            setTimeout(() => showSettingsAlert && alertWrapper(permissionText, permissionTitle), ALERT_TIMEOUT);
                            reject(PERMISSION_STATUS.DENIED);
                        }
                    };
                } else if (authorizationStatus === Location.iOS.AuthorizationStatus.RESTRICTED) {
                    reject(PERMISSION_STATUS.NEVER_ASK_AGAIN);
                }
            } else {
                // Hardcoded logic for iOS to pass
                resolve();
            }
        } else {
            const requestPermissionCode = lastRequestPermissionCode++;
            const prevPermissionRationale = Application.android
                .shouldShowRequestPermissionRationale(androidPermission);
            if (Application.android.checkPermission(androidPermission)) {
                resolve();
            } else {
                Application.android.onRequestPermissionsResult = (e) => {
                    const currentPermissionRationale = Application.android
                        .shouldShowRequestPermissionRationale(androidPermission);
                    if (e.requestCode === requestPermissionCode && e.result) {
                        resolve(PERMISSION_STATUS.GRANTED);
                    } else if (!e.result && !currentPermissionRationale && !prevPermissionRationale) {
                        setTimeout(() => showSettingsAlert && alertWrapper(permissionText, permissionTitle), ALERT_TIMEOUT);
                        reject(PERMISSION_STATUS.NEVER_ASK_AGAIN);
                    } else {
                        reject(PERMISSION_STATUS.DENIED);
                    }
                };
                Application.android.requestPermissions(requestPermissionCode, androidPermission);
            }
        }
    });
}

exports.getPermission = getPermission;
exports.PERMISSION_STATUS = PERMISSION_STATUS;
exports.IOS_PERMISSIONS = IOS_PERMISSIONS;
