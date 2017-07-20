const Page          = require("sf-core/ui/page");
const extend        = require("js-base/core/extend");
const Button        = require('sf-core/ui/button');
const TextBox       = require('sf-core/ui/textbox');
const FlexLayout    = require('sf-core/ui/flexlayout');
const Speech2TextUtil = require('sf-extension-utils/speech2text');

var pageSpeech2Text = extend(Page)(
    function(_super) {
        _super(this);
        
        var myTextBoxInput = new TextBox({
            height: 75,
            width: 200,
            margin: 15,
            hint: "Text will appear here",
            alignSelf: FlexLayout.AlignSelf.CENTER
        });
        
        var myButtonStart = new Button({
            text: 'Start with 4000ms Delay',
            height: 75,
            width: 250,
            margin: 15,
            alignSelf: FlexLayout.AlignSelf.CENTER,
            onPress: function() {
				Speech2TextUtil.startType(myTextBoxInput,4000);
            }.bind(this)
        });
        
		this.layout.justifyContent = FlexLayout.JustifyContent.CENTER;
        this.layout.addChild(myTextBoxInput);
        this.layout.addChild(myButtonStart);
    }
);

module.exports = pageSpeech2Text;