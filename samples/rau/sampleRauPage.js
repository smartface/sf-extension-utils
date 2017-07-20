const Page				= require('sf-core/ui/page');
const extend			= require("js-base/core/extend");
const Color 			= require('sf-core/ui/color');
const Button			= require('sf-core/ui/button');
const FlexLayout		= require("sf-core/ui/flexlayout");
const RauLib			= require("sf-extension-utils/rau");

var pageRAU = extend(Page)(
	function(_super) {
		_super(this);
		
		var btnRau = new Button({
			height: 75,
			width: 100,
			margin: 10,
			alignSelf: FlexLayout.AlignSelf.CENTER,
			text: "Test RAU",
			onPress: function(){
				RauLib.checkUpdate();
			}
		});
		
		var btnRauWithOptions = new Button({
			height: 75,
			width: 100,
			margin: 10,
			alignSelf: FlexLayout.AlignSelf.CENTER,
			text: "Test RAU Options",
			onPress: function(){
				RauLib.checkUpdate({
					showProgressCheck: true,
					showProgressErrorAlert: true
				});
			}
		});
		
		this.layout.flexDirection = FlexLayout.FlexDirection.COLUMN;
		this.layout.justifyContent = FlexLayout.JustifyContent.CENTER;

		this.layout.addChild(btnRau);
		this.layout.addChild(btnRauWithOptions);
	}
);

module.exports = pageRAU;