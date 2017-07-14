/* globals lang */
const Application = require("sf-core/application");
const AlertView = require('sf-core/ui/alertview');
const Network = require('sf-core/device/network');
const skipErrList = ["channel not found", "No update"];
const System = require('sf-core/device/system');
const app = {
    checkUpdate: Application.checkUpdate ? Application.checkUpdate : global.Application.checkUpdate
};

function checkUpdate(options) {
    console.log("inside check update");
    options = options || {};

    if (Network.connectionType === Network.ConnectionType.None) {
        return;
    }

    //Checks if there is a valid update. If yes returns result object.
    var updateProgressAlert;
    if(options.showProgressCheck){
        updateProgressAlert = new AlertView({
            message: lang.checkingUpdate || "Checking for updates"
        });
        // Wait until IOS-2302
        (System.OS === "Android") && (updateProgressAlert.android.cancellable = false);
        updateProgressAlert.show();
    }
    app.checkUpdate(function(err, result) {
        if(options.showProgressCheck && updateProgressAlert){
            updateProgressAlert.dismiss();
        }
        if (err) {
            if (typeof err === "object") {
                try {
                    err = JSON.stringify(err, null, "\t");
                }
                finally {

                }
            }
            if(options.showProgressErrorAlert){
                var informationAlert = new AlertView({
    				message: lang.noupdate || "No new updates were found"
    			});
    			informationAlert.addButton({
    				text: lang.ok || "OK",
    				type: AlertView.Android.ButtonType.POSITIVE,
    			});
    			informationAlert.show();
            }
        }
        else {
            console.log("update check successfull");
            //Update check is successful. We can show the meta info to inform our app user.
            result.meta = result.meta || {};
            var isMandatory = (result.meta.isMandatory && result.meta.isMandatory === true) ? true : false;
            var updateTitle = (result.meta.title) ? result.meta.title : (lang.newVersionAvailable || 'A new update is ready!');
            var updateMessage = (lang.version || "Version") + " " + result.newVersion + " " + (lang.isReadyToInstall || "is ready to install") + ".\n\n";
            updateMessage += (isMandatory) ? (lang.updateMandatory || "This update is mandatory!") :
                (lang.updateOptional || "Do you want to update?");

            if (options.silent) {
                startUpdate();
            }
            else {
                if (isMandatory) {
                    showConfirmationDialog(
                        updateTitle,
                        updateMessage,
                        [
                            {
                                text: lang.updateNow || "Update now",
                                onClick: startUpdate,
                                type: AlertView.Android.ButtonType.POSITIVE
                            }
                        ]);
                }
                else {
                    showConfirmationDialog(
                        updateTitle,
                        updateMessage,
                        [
                            {
                                text: lang.updateNow || "Update now",
                                onClick: startUpdate,
                                index: AlertView.Android.ButtonType.POSITIVE
                            },
                            {
                                text: lang.later || "Later",
                                onClick: doNothing,
                                index: AlertView.Android.ButtonType.NEUTRAL
                            }
                        ]);
                }
            }
        }


        function startUpdate() {
            if (System.OS === "iOS") {
                performUpdate();
            }
            else {
                if (Application.android.checkPermission(Application.android.Permissions.WRITE_EXTERNAL_STORAGE)){
                    performUpdate();
                }
                else{
                    Application.android.requestPermissions(1002, Application.android.Permissions.WRITE_EXTERNAL_STORAGE);
                    Application.android.onRequestPermissionsResult = function(e){
                        if(e.requestCode === 1002){
                            if(e.result){
                                performUpdate();
                            }
                            else{
                                showConfirmationDialog(
                                    lang.permissionRequiredTitle || "Permission Required",
                                    lang.permissionRequiredMessage || "You should grand permission for update. Would you want to try again?",
                                    [
                                        {
                                            text: lang.tryAgain || "Try Again",
                                            onClick: startUpdate,
                                            index: AlertView.Android.ButtonType.POSITIVE
                                        },
                                        {
                                            text: lang.cancel || "Cancel",
                                            onClick: doNothing,
                                            index: AlertView.Android.ButtonType.NEUTRAL
                                        }
                                    ]);
                            }
                        }
                    }
                }
            }

        }

        function performUpdate() {
            var updateProgressAlert = new AlertView({
                title: "Warning",
                message: lang.updateIsInProgress || "Update is in progress"
            });
            (System.OS === "Android") && (updateProgressAlert.android.cancellable = false);
            updateProgressAlert.show();
            if (result.meta.redirectURL && result.meta.redirectURL.length != 0) {
                //RAU wants us to open a URL, most probably core/player updated and binary changed.
                Application.call(result.meta.redirectURL);
            }
            else {
                //There is an update waiting to be downloaded. Let's download it.
                result.download(function(err, result) {
                    if (err) {
                        //Download failed
                        handleError(err);
                    }
                    else {
                        //All files are received, we'll trigger an update.
                        result.updateAll(function(err) {
                            if (err) {
                                //Updating the app with downloaded files failed
                                handleError(err);
                            }
                            else {
                                //After that the app will be restarted automatically to apply the new updates
                                Application.restart();
                            }
                        });
                    }
                });
            }

            function handleError(err) {
                if (typeof err === "object") {
                    try {
                        err = JSON.stringify(err, null, "\t");
                    }
                    finally {

                    }
                }
                updateProgressAlert.dismiss();
            }
        }

        //We will do nothing on cancel for the timebeing.
        function doNothing() {
            //do nothing
        }
        //if Update is mandatory we will show only Update now button.


    });
    
    function showAlertDialog(message)
    {
        var myAlertView = new AlertView({
            title: "Warning",
            message: message
        });
        (System.OS === "Android") && (myAlertView.android.cancellable = false);
        myAlertView.addButton({
            index: AlertView.ButtonType.NEGATIVE,
            text: "OK"
        });

        myAlertView.show();
    }
    
    function showConfirmationDialog(title,message,buttons)
    {
        var myAlertView = new AlertView({
            title: title,
            message: message
        });
        (System.OS === "Android") && (myAlertView.android.cancellable = false);
        
        for (var i=0;i<buttons.length;i++)
        {
             myAlertView.addButton(buttons[i])
        }

        myAlertView.show();
    }
        
}

exports.checkUpdate = checkUpdate;
