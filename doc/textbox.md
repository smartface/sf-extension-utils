<a name="module_textBox"></a>

## textBox : <code>object</code>
Smartface TextBox util module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  
<a name="module_textBox.setMaxtLenth"></a>

### textBox.setMaxtLenth()
Sets the max length for the textbox. This is replacing the onTextChanged
event for the textbox. In order to use the onTextChanged, use the given
option to set the onTextChanged event. It is possible to target TextArea too.

**Kind**: static method of [<code>textBox</code>](#module_textBox)  
**Access**: public  
**Params**: <code>UI.TextBox\|UI.TextArea</code> textBox - target textBox to limit the max length  
**Params**: <code>number</code> maxLength - Maximum text length of the TextBox  
**Params**: <code>function</code> [onTextChange] - User defined onTextChanged event for the TextBox  
**Example**  
```js
import textBoxUtil from "sf-extension-utils/lib/textbox";
//inside page.onLoad
const page = this;
const tb = page.textBox1;
const ta = page.textArea1;

textBoxUtil.setMaxtLenth(tb, 10, function(e) {
    console.log("user textChanged for TextBox");
});

textBoxUtil.setMaxtLenth(ta, 10, function(e) {
    console.log("user textChanged for TextArea");
});
```
