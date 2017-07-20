const Page          = require("sf-core/ui/page");
const extend        = require("js-base/core/extend");
const Button        = require('sf-core/ui/button');
const FlexLayout    = require('sf-core/ui/flexlayout');
const AlertViewUtil = require('sf-extension-utils/alert');

var pageAlert = extend(Page)(
    function(_super) {
        _super(this);
        
        var myButtonAlertMessage = new Button({
            text: 'Alert Message',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				AlertViewUtil.showAlert("Message");
            }.bind(this)
        });
        
        var myButtonAlertTitleMessage = new Button({
            text: 'Alert with Message Title',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				AlertViewUtil.showAlert("Title", "Message");
            }.bind(this)
        });
        
        var myButtonAlertTitleMessageCallback = new Button({
            text: 'Alert with Callbacks',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				AlertViewUtil.showAlert("Title", "Message", {
                    text: "Negative Button",
                    callback: function(){
                        AlertViewUtil.showAlert("NegativeButton Clicked!");
                    }
                }, {
                    text: "Positive Button",
                    callback: function(){
                        AlertViewUtil.showAlert("Positive Button Clicked!");
                    }
                });
            }.bind(this)
        });
        
		this.layout.justifyContent = FlexLayout.JustifyContent.CENTER;
        this.layout.addChild(myButtonAlertMessage);
        this.layout.addChild(myButtonAlertTitleMessage);
        this.layout.addChild(myButtonAlertTitleMessageCallback);
    }
);

module.exports = pageAlert;