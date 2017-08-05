const System    = require('sf-core/device/system');
const Data      = require('sf-core/data');
const AlertView = require('sf-core/ui/alertview');

/**
 * @class FingerPrintUtil
 * @since 1.1.3
 * 
 * An util class for Fingerprint operations.
 */
const FingerPrintUtil = {};

Object.defineProperties(FingerPrintUtil, {
    /**
     * Check user rejected fingerprint. When you call {@link FingerPrintUtil#registerFingerPrint} 
     * it shows confirmation dialog to user for usage about fingerprint. When user rejected it
     * by clicking "Cancel" on that dialog this variable becomes true.
     * 
     * @property {Boolean} [isUserRejectedFingerprint = false]
     * @readonly
     * @android
     * @ios
     * @static
     * @since 1.0.0
     */
    'isUserRejectedFingerprint': {
        get: function() {
            return Data.getBooleanVariable('isRejectedFingerprint') === true;
        },
        set: function(isRejectedFingerprint) {
            Data.setBooleanVariable('isRejectedFingerprint', isRejectedFingerprint);
        },
        enumarable: true
    },
    
    /**
     * Check user could verified fingerprint. When you call {@link FingerPrintUtil#registerFingerPrint} 
     * it shows fingerprint dialog after confirmation dialog. When user's fingerprint verified by system,
     * this variable becomes true.
     * 
     * @property {Boolean} [isUserVerifiedFingerprint = false]
     * @readonly
     * @android
     * @ios
     * @static
     * @since 1.0.0
     */
    'isUserVerifiedFingerprint': {
        get: function() {
            return Data.getBooleanVariable('isVerifiedFingerprint') === true;
        },
        set: function(isVerifiedFingerprint) {
            Data.setBooleanVariable('isVerifiedFingerprint', isVerifiedFingerprint);
        },
        enumarable: true
    },
    
    /**
     * Check user allowed fingerprint. When you call {@link FingerPrintUtil#registerFingerPrint} 
     * it shows confirmation dialog to user for usage about fingerprint. When user allowed it
     * by clicking "Okay" on that dialog this variable becomes true.
     * 
     * @property {Boolean} [isUserAllowedFingerprint = false]
     * @readonly
     * @android
     * @ios
     * @static
     * @since 1.0.0
     */
    'isUserAllowedFingerprint': {
        get: function() {
            return Data.getBooleanVariable('isAllowedFingerprint') === true;
        },
        set: function(isAllowedFingerprint) {
            Data.setBooleanVariable('isAllowedFingerprint', isAllowedFingerprint);
        },
        enumarable: true
    },
    
    /**
     * Check device supports fingerprint (Android) or TouchID for iOS. This variables reflects {@link Device.System#fingerPrintAvailable}
     * 
     * @property {Boolean} isFingerprintAvailable
     * @readonly
     * @android
     * @ios
     * @static
     * @since 1.0.0
     */
    'isFingerprintAvailable': {
        get: function() {
            return System.fingerPrintAvailable;
        },
        enumarable: true
    },
    
    /**
     * Registers user to the fingerprint authentication. This function asks user that user want to use fingerprint for 
     * next login and if user wants by clicking "Okay" on "Finger Print Access" dialog, this method calls {@link Device.System#validateFingerPrint}.
     * If fingerprint is not available, user rejected fingerprint, user rejected fingerprint by clicking "cancel" on 
     * "Finger Print Access" dialog or user cannot validate fingerprint with fingerprint dialog onFailure callback 
     * will be tiggered.
     * 
     * @param {Function} onSuccess
     * @param {Function} onFailure
     * @method registerFingerPrint
     * @readonly
     * @android
     * @ios
     * @static
     * @since 1.0.0
     */ 
    'registerFingerPrint': {
        value: function(onSuccess, onFailure) {
            if (!FingerPrintUtil.isFingerprintAvailable) {
                //Finger print is not available
                onFailure && onFailure();
                return;
            }
            else if (FingerPrintUtil.isUserRejectedFingerprint) {
                // We asked to user and he/she rejected to use fingerprint
                onFailure && onFailure();
                return false;
            }
            else if(FingerPrintUtil.isUserVerifiedFingerprint){
                FingerPrintUtil.validateFingerPrint(onSuccess, onFailure);
            }
            else if(!FingerPrintUtil.isUserRejectedFingerprint){
                // user not allowed fingerprint before but want to allow. we will ask on confirmation popup
                var myAlertView = new AlertView({
                    title: "Finger Print Access",
                    message: "Do you want to use fingerprint for future sign in operations? "
                });
                myAlertView.addButton({
                    index: AlertView.ButtonType.NEGATIVE,
                    text: "Cancel",
                    onClick: function() {
                        FingerPrintUtil.isUserRejectedFingerprint = true;
                        onFailure && onFailure();
                    }
                });
                myAlertView.addButton({
                    index: AlertView.ButtonType.POSITIVE,
                    text: "Okay",
                    onClick: function() {
                        FingerPrintUtil.isUserAllowedFingerprint = true;
                        System.validateFingerPrint({
                            android: {
                                title: "Validate"
                            },
                            message: "Validate your fingerprint",
                            onSuccess: function() {
                                FingerPrintUtil.isUserVerifiedFingerprint = true;
                                onSuccess && onSuccess();
                                return;
                            },
                            onError: function() {
                                FingerPrintUtil.isUserVerifiedFingerprint = false;
                                onFailure && onFailure();
                                return;
                            }
                        });
                    }
                });
                myAlertView.show();
                return;
            }
            onFailure && onFailure();
        },
        enumarable: true
    },
    
    /**
     * Validates user to the fingerprint authentication. This method calls {@link Device.System#validateFingerPrint}.
     * If fingerprint is not available, user rejected fingerprint or user cannot validate fingerprint with fingerprint dialog onFailure callback 
     * will be tiggered.
     * 
     * @param {Function} onSuccess
     * @param {Function} onFailure
     * @method validateFingerPrint
     * @readonly
     * @android
     * @ios
     * @static
     * @since 1.0.0
     */ 
    'validateFingerPrint': {
        value: function(onSuccess, onFailure) {
            if (!FingerPrintUtil.isFingerprintAvailable) {
                //Finger print is not available
                onFailure && onFailure();
                return;
            }
            else if (FingerPrintUtil.isUserRejectedFingerprint) {
                // We asked to user and he/she rejected to use fingerprint
                onFailure && onFailure();
                return false;
            }
            else {
                System.validateFingerPrint({
                    android: {
                        title: "Verify"
                    },
                    message: "Verify your fingerprint",
                    onSuccess: function() {
                        FingerPrintUtil.isUserVerifiedFingerprint = true;
                        onSuccess && onSuccess();
                        return;
                    },
                    onError: function() {
                        FingerPrintUtil.isUserVerifiedFingerprint = false;
                        onFailure && onFailure();
                        return;
                    }
                });
            }
        },
        enumarable: true
    },
    
    /**
     * Reset saved state about fingerprint. 
     * 
     * @method reset
     * @readonly
     * @android
     * @ios
     * @static
     * @since 1.0.1
     */ 
    'reset': {
        value: function(){
            Data.removeVariable('isRejectedFingerprint');
            Data.removeVariable('isVerifiedFingerprint');
            Data.removeVariable('isAllowedFingerprint');
        },
        enumarable: true
    }
});

module.exports = FingerPrintUtil;