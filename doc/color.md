<a name="module_color"></a>

## color : <code>object</code>
Smartface Color Util module

**See**: [tinycolor2](https://www.npmjs.com/package/tinycolor2)  
**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  
**Example**  
```js
const Color = require('sf-core/ui/color');
const colorUtil = require("sf-extension-utils/lib/color");
colorUtil.rgb(Color.RED); //#ff0000
colorUtil.rgb(Color.BLUE).tinycolor.darken().toHexString(); //'#0000cc'
```

* [color](#module_color) : <code>object</code>
    * [.rgb()](#module_color.rgb) ⇒ <code>string</code>
    * [.rgba()](#module_color.rgba) ⇒ <code>string</code>
    * [.argb()](#module_color.argb) ⇒ <code>string</code>
    * [.tinycolor()](#module_color.tinycolor) ⇒ <code>tinycolor</code>

<a name="module_color.rgb"></a>

### color.rgb() ⇒ <code>string</code>
Returns 6 digit hexadecimal string from Color object. Does not start with # character

**Kind**: static method of [<code>color</code>](#module_color)  
**Returns**: <code>string</code> - Hexadecimal RGB representation of the color  
**Access**: public  
**Params**: <code>UI.Color</code> color - Smartface Color Object, without gradient  
<a name="module_color.rgba"></a>

### color.rgba() ⇒ <code>string</code>
Returns 8 digit hexadecimal string from Color object. Does not start with # character

**Kind**: static method of [<code>color</code>](#module_color)  
**Returns**: <code>string</code> - Hexadecimal RGBA representation of the color  
**Access**: public  
**Params**: <code>UI.Color</code> color - Smartface Color Object, without gradient  
<a name="module_color.argb"></a>

### color.argb() ⇒ <code>string</code>
Returns 8 digit hexadecimal string from Color object. Does not start with # character

**Kind**: static method of [<code>color</code>](#module_color)  
**Returns**: <code>string</code> - Hexadecimal ARGB representation of the color  
**Access**: public  
**Params**: <code>UI.Color</code> color - Smartface Color Object, without gradient  
<a name="module_color.tinycolor"></a>

### color.tinycolor() ⇒ <code>tinycolor</code>
Creates a tinycolor object from UI.Color

**Kind**: static method of [<code>color</code>](#module_color)  
**Access**: public  
**Params**: <code>UI.Color</code> color - Smartface Color Object, without gradient  
**See**: [TinyColor](https://github.com/bgrins/TinyColor)  
