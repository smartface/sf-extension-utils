<a name="module_EmojiAnimation"></a>

## EmojiAnimation : <code>Object</code>
**Author**: Ali Tugrul Pinar <ali.pinar@smartface.io>  
**Copyright**: Smartface 2020  
<a name="module_EmojiAnimation..Play emojis with animation effects"></a>

### EmojiAnimation~Play emojis with animation effects(options)
**Kind**: inner method of [<code>EmojiAnimation</code>](#module_EmojiAnimation)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | Cofiguration of emoji animation (required) |
| options.webView | <code>object</code> |  | WebView instance to render animation effects (required) |
| [options.emojis] | <code>number</code> | <code>[]</code> | Array of emojis (base64 images) |
| [options.emojiBoxWidth] | <code>number</code> | <code>100px</code> | Width of emoji box |
| [options.emojiBoxHeight] | <code>number</code> | <code>80px</code> | Heght of emoji box |

**Example**  
```js
import EmojiAnimation from "sf-extension-utils/lib/art/EmojiAnimation";

const emojiAnimation = new EmojiAnimation({
    webView: this.webViewComponent,
    emojis: ["data:image/png;base64,iVBs4c6QAAORw0KGgoAAAANSUh"]
});

// Play first emoji on webview
emojiAnimation.playEmoji(0);
```
