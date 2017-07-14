const Page				= require('sf-core/ui/page');
const extend			= require("js-base/core/extend");
const Color 			= require('sf-core/ui/color');
const Button			= require('sf-core/ui/button');
const FlexLayout		= require("sf-core/ui/flexlayout");
const FingerPrintLib    = require("sf-extension-utils/fingerprint");
const TextBox   		= require("sf-core/ui/textbox");
const TextAlignment 	= require('sf-core/ui/textalignment');
const Data 				= require('sf-core/data');
const Font 				= require('sf-core/ui/font');
const AlertView 		= require('sf-core/ui/alertview');

var pageFingerprint = extend(Page)(
	function(_super) {
		_super(this);
		
		var textboxUsername = new TextBox({
			width: 150,
			height: 75,
			margin: 10,
			hint: "Username",
			borderColor: Color.BLACK,
			borderWidth: 1,
			borderRadius: 10,
			font: Font.create("Arial", 10, Font.BOLD),
			alignSelf: FlexLayout.AlignSelf.CENTER,
			textAlignment: TextAlignment.MIDCENTER,
		});
		
		var textboxPassword = new TextBox({
			width: 150,
			height: 75,
			margin: 10,
			hint: "Password",
			borderColor: Color.BLACK,
			borderWidth: 1,
			borderRadius: 10,
			font: Font.create("Arial", 10, Font.BOLD),
			alignSelf: FlexLayout.AlignSelf.CENTER,
			textAlignment: TextAlignment.MIDCENTER,
			isPassword: true
		});
		
		var btnSignIn = new Button({
			height: 75,
			width: 150,
			marginTop: 25,
			alignSelf: FlexLayout.AlignSelf.CENTER,
			text: "Sign In",
			onPress: function(){
				checkLogin(textboxUsername.text, textboxPassword.text);
			}
		});
		
		this.layout.flexWrap = FlexLayout.FlexWrap.WRAP;
		this.layout.flexDirection = FlexLayout.FlexDirection.COLUMN;
		this.layout.justifyContent = FlexLayout.JustifyContent.CENTER;

		this.layout.addChild(textboxUsername);
		this.layout.addChild(textboxPassword);
		this.layout.addChild(btnSignIn);
	}
);

function checkLogin(userName, password){
	if(userName === ""){
        showAlert("Username can not be empty");
		return;
    }
    
    if(!Data.getBooleanVariable('isNotFirstLogin')){
        if (password === "") {
            // Validate fingerPrint
    		showAlert("Password can not be empty.");
    		return; 
    	}
    }
    
	if(FingerPrintLib.isUserVerifiedFingerprint){
		// Second+ logging. No need to register fingerprint user already do it before.
		if (password !== "") {
            // Validate fingerPrint
    		doLogin();
    		return;
    	}
		else{
		    FingerPrintLib.validateFingerPrint(function(){
		        doLogin();
		    }, function() {
		        if (password === "") {
	                // Validate fingerPrint
	        		showAlert("Password can not be empty.");
	        		return; 
	        	}
	        	doLogin();
		    });
		    return;
		}
	}
	else if(FingerPrintLib.isFingerprintAvailable){
	    if(FingerPrintLib.isUserAllowedFingerprint){
	    	// Second+ logging. But user not registered fingerprint. But password supplied skip fingerprint
			if (password !== "") {
	            // Validate fingerPrint
	    		doLogin();
    		    return;
	    	}
			else{
		        FingerPrintLib.validateFingerPrint(function(){
	    	        doLogin();
	    	    }, function(){
		            if (password === "") {
	                    // Validate fingerPrint
	            		showAlert("Password can not be empty.");
	            		return; 
	            	}
	            	doLogin();
	    	    });
	    	    return;
			}
	    }
	    // first logging and ask user to register fingerprint
	    else if(!FingerPrintLib.isUserRejectedFingerprint){
	        FingerPrintLib.registerFingerPrint(function(){
    	        doLogin();
    	    }, function(){
	            if (password === "") {
                    // Validate fingerPrint
            		showAlert("Password can not be empty.");
            		return; 
            	}
            	doLogin();
    	    });
    	    return;
	    }
	    
	}
	
	if (password === "") {
        // Validate fingerPrint
		showAlert("Password can not be empty.");
		return; 
	}
    
    doLogin();
}

function showAlert(text){
	var myAlertView = new AlertView({
        message: text
    });
    myAlertView.addButton({
        type: AlertView.Android.ButtonType.POSITIVE,
        text: "OK"
    });
    myAlertView.show();
}

function doLogin(){
	Data.setBooleanVariable('isNotFirstLogin', true);
	showAlert("Successfully Logged in");
}

module.exports = pageFingerprint;