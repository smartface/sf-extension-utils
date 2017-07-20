const Page              = require("sf-core/ui/page");
const extend            = require("js-base/core/extend");
const Button            = require('sf-core/ui/button');
const FlexLayout        = require('sf-core/ui/flexlayout');
const Application       = require('sf-core/application');
const PermissionUtil    = require('sf-extension-utils/permission');
const AlertViewUtil     = require('sf-extension-utils/alert');

var pagePermission = extend(Page)(
    function(_super) {
        _super(this);
        
        var myButtonCheckCalendar = new Button({
            text: 'Check READ_CALENDAR',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				PermissionUtil.applyPermission(Application.android.Permissions.READ_CALENDAR, function(result){
				    AlertViewUtil.showAlert("READ_CALENDAR permission result: " + result);
				});
            }.bind(this)
        });
        
        var myButtonCheckCallLog = new Button({
            text: 'Check READ_CALL_LOG ',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				PermissionUtil.applyPermission(Application.android.Permissions.READ_CALL_LOG , function(result){
				    AlertViewUtil.showAlert("READ_CALL_LOG permission result: " + result);
				});
            }.bind(this)
        });
        
        var myButtonCheckContacts = new Button({
            text: 'Check READ_CONTACTS ',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				PermissionUtil.applyPermission(Application.android.Permissions.READ_CONTACTS , function(result){
				    AlertViewUtil.showAlert("READ_CONTACTS permission result: " + result);
				});
            }.bind(this)
        });
        
        var myButtonCheckPhoneState = new Button({
            text: 'Check READ_PHONE_STATE  ',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				PermissionUtil.applyPermission(Application.android.Permissions.READ_PHONE_STATE , function(result){
				    AlertViewUtil.showAlert("READ_PHONE_STATE permission result: " + result);
				});
            }.bind(this)
        });
        
        var myButtonCheckSMS = new Button({
            text: 'Check READ_SMS',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				PermissionUtil.applyPermission(Application.android.Permissions.READ_SMS , function(result){
				    AlertViewUtil.showAlert("READ_SMS permission result: " + result);
				});
            }.bind(this)
        });
        
        var myButtonCheckAudio = new Button({
            text: 'Check RECORD_AUDIO ',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				PermissionUtil.applyPermission(Application.android.Permissions.RECORD_AUDIO  , function(result){
				    AlertViewUtil.showAlert("RECORD_AUDIO  permission result: " + result);
				});
            }.bind(this)
        });
        
		this.layout.justifyContent = FlexLayout.JustifyContent.CENTER;
        this.layout.addChild(myButtonCheckCalendar);
        this.layout.addChild(myButtonCheckCallLog);
        this.layout.addChild(myButtonCheckContacts);
        this.layout.addChild(myButtonCheckPhoneState);
        this.layout.addChild(myButtonCheckSMS);
        this.layout.addChild(myButtonCheckAudio);
    }
);

module.exports = pagePermission;