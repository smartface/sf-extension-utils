/* eslint-disable import/no-unresolved */

/**
 * Smartface Android & Partly iOS Permission module
 * @module permission
 * @type {object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @author Alim Öncül <alim.oncul@smartface.io>
 * @copyright Smartface 2020
 */

const System = require('sf-core/device/system');
const Application = require('sf-core/application');
const AlertView = require('sf-core/ui/alertview');
const Multimedia = require('sf-core/device/multimedia');
const { openApplicationSettings } = require('sf-extension-utils/lib/settings');
const langChecker = require('../base/langchecker')('permission');

langChecker.check(['permissionRequiredTitle']);

let lastRequestPermissionCode = 2000;

const PERMISSION_STATUS = {
    GRANTED: 'GRANTED',
    DENIED: 'DENIED',
    NEVER_ASK_AGAIN: 'NEVER_ASK_AGAIN'
};

const IOS_PERMISSIONS = {
    CAMERA: 'CAMERA'
};

function alertWrapper(permissionText) {
    if (System.OS === "iOS") {
        __SF_Dispatch.mainAsync(function() {
            showAlertAndRedirectToSettings(permissionText);
        });
    } else {
        showAlertAndRedirectToSettings(permissionText);
    }
}

function showAlertAndRedirectToSettings(permissionText) {
    const alertView = alert({
        title: global.lang.permissionRequiredTitle || 'Permissions required',
        message: permissionText || 'Please grant related permissions for application to work properly',
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

function getPermission({ androidPermission, permissionText = '', iosPermission }) {
    return new Promise((resolve, reject) => {
        if (System.OS === 'iOS') {
            if (iosPermission === IOS_PERMISSIONS.CAMERA) {
                if (Multimedia.ios.getCameraAuthorizationStatus() !==
                    Multimedia.iOS.CameraAuthorizationStatus.AUTHORIZED) {
                    Multimedia.ios.requestCameraAuthorization((status) => {
                        if (status) {
                            resolve();
                        } else {
                            alertWrapper(permissionText)
                            reject(PERMISSION_STATUS.DENIED);
                        }
                    });
                } else {
                    resolve();
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
                        setTimeout(() => alertWrapper(permissionText), 500);
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