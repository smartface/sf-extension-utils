<a name="module_CircularProgressBar"></a>

## CircularProgressBar : <code>Object</code>
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2020  
<a name="module_CircularProgressBar..Renders circle shaped progress bar in a WebView"></a>

### CircularProgressBar~Renders circle shaped progress bar in a WebView(options)
**Kind**: inner method of [<code>CircularProgressBar</code>](#module_CircularProgressBar)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | Cofiguration of circular progress bar (required) |
| options.webView | <code>object</code> |  | WebView instance to render the progress bar (required) |
| [options.strokeWidth] | <code>number</code> | <code>4</code> | Width of the stroke |
| [options.color] | <code>string</code> | <code>&quot;#555&quot;</code> | Stroke color |
| [options.duration] | <code>number</code> | <code>2</code> | Duration for animation in seconds |
| [options.trailColor] | <code>string</code> | <code>&quot;#eee&quot;</code> | Color for lighter trail stroke underneath the actual progress path |
| [options.trailWidth] | <code>number</code> | <code>4</code> | Width of the trail stroke |
| [options.width] | <code>number</code> | <code>100</code> | Size of the progress bar (both width & height) |

**Example**  
```js
import CircularProgressBar from "@smartface/extension-utils/lib/art/CircularProgressBar";

const circularProgressBar = new CircularProgressBar({
    width: 130,
    trailColor: "rgb(247,201,71)",
    color: "rgb(55,85,147)",
    webView: this.wvCircularAnimation
});

// Triggers the render method whenever the value is set
circularProgressBar.value = 70;
```
