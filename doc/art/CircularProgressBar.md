<a name="module_CircularProgressBar"></a>

## CircularProgressBar : <code>Object</code>
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2020  
<a name="module_CircularProgressBar..Renders circle shaped progress bar in a WebView"></a>

### CircularProgressBar~Renders circle shaped progress bar in a WebView()
**Kind**: inner method of [<code>CircularProgressBar</code>](#module_CircularProgressBar)  
**Example**  
```js
const CircularProgressBar = require("sf-extension-utils/lib/art/CircularProgressBar");

let circularProgressBar = new CircularProgressBar({
    width: 130,
    trailColor: "rgb(247,201,71)",
    color: "rgb(55,85,147)",
    webView: this.wvCircularAnimation 
});
circularProgressBar.value = 70;
```
