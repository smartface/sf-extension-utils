const System = require('sf-core/device/system');
const Data = require('sf-core/data');
const AlertView = require('sf-core/ui/alertview');

const FingerPrintUtil = {};

Object.defineProperties(FingerPrintUtil, {
    'isUserAuthenticated': {
        get: function() {
            return Data.getBooleanVariable('isAuthenticated') === true;
        },
        set: function(isAuthenticated) {
            Data.setBooleanVariable('isAuthenticated', isAuthenticated);
        },
        enumarable: true
    },
    'isUserRejectedFingerprint': {
        get: function() {
            return Data.getBooleanVariable('isRejectedFingerprint') === true;
        },
        set: function(isRejectedFingerprint) {
            Data.setBooleanVariable('isRejectedFingerprint', isRejectedFingerprint);
        },
        enumarable: true
    },
    'isUserVerifiedFingerprint': {
        get: function() {
            return Data.getBooleanVariable('isVerifiedFingerprint') === true;
        },
        set: function(isVerifiedFingerprint) {
            Data.setBooleanVariable('isVerifiedFingerprint', isVerifiedFingerprint);
        },
        enumarable: true
    },
    'isUserAllowedFingerprint': {
        get: function() {
            return Data.getBooleanVariable('isAllowedFingerprint') === true;
        },
        set: function(isAllowedFingerprint) {
            Data.setBooleanVariable('isAllowedFingerprint', isAllowedFingerprint);
        },
        enumarable: true
    },
    'isFingerprintAvailable': {
        get: function() {
            return System.fingerPrintAvailable;
        },
        enumarable: true
    },

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
                                FingerPrintUtil.isUserAuthenticated = true;
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
    'reset': {
        value: function(){
            Data.removeVariable('isAuthenticated');
            Data.removeVariable('isRejectedFingerprint');
            Data.removeVariable('isVerifiedFingerprint');
            Data.removeVariable('isAllowedFingerprint');
        },
        enumarable: true
    }
});

module.exports = FingerPrintUtil;