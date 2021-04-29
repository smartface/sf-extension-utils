<a name="module_html-to-text"></a>

## html-to-text : <code>Class</code>
Smartface html-to-text util

**Author**: Furkan Arabacı <furkan.arabaci@smartface.io>  
**Author**: Ali Tuğrul Pınar <ali.pinar@smartface.io>  
**Copyright**: Smartface 2021  

* [html-to-text](#module_html-to-text) : <code>Class</code>
    * [~HTML](#module_html-to-text..HTML)
    * [~createAttributedTexts(htmlSource)](#module_html-to-text..createAttributedTexts) ⇒ <code>Array.&lt;AttributedString&gt;</code>
    * [~createAttributedStrings(htmlSource)](#module_html-to-text..createAttributedStrings) ⇒ <code>Array.&lt;AttributedString&gt;</code>

<a name="module_html-to-text..HTML"></a>

### html-to-text~HTML
When you have a html, but don't want to create a WebView to render the texts, this utility is what you are looking for.
However, converting html to native Smartface component has their own limitations. If not, the result may not be the desired one.

## Limitations & Rules

  1. If you want to write **newline** character, you can use these tags **\<br\>**, **\<div\>** or use "\n".
      - "attributed \<br\> string"
      - "attributed \<div\> string\</div\>"
      - "attributed \n string"

  2. You can use following html tags
      - **br**     → newline
      - **div**    → newline and general tag for styling
      - **span**   → general tag for styling
      - **font**   → has attribute as color(**color**), size(**font-size**) and face(**font-family**)
      - **b**      → bold style
      - **u**      → underline style
      - **i**      → italic style
      - **a**      → has attribute **href** for link.
      - **s**      → line-through
      - **strike** → line-through

  3. You can only use following css styles
      - font.family-style      → **font-family** → ```"font-family: Nunito-ExtraBold;"```
      - font.italic            → **font-style** → ```"font-style: italic;"```
      - font.size              → **font-size** → ```"font-size: 24px;" (24pt, 24dp)```
      - font.bold              → **font-weight** → ```"font-weight: bold;"```
      - foregroundColor        → **color** → ```"color: rgb(127, 125, 127);"```
      - backgroundColor        → **background-color** → ```"background-color: rgb(255, 125, 127);"```
      - underline              → **text-decoration-line** → ```"text-decoration-line: underline;"```
      - strikethrough          → **text-decoration-line** → ```"text-decoration-line: line-through;"```
      - link                   → **href** → ```"click <a href=\"https://smartface.io\"> here </a> "```
      - ios.underlineColor     → **text-decoration-color** → ```"text-decoration-color: rgba(255, 125, 128);"```
      - ios.strikethroughColor → **text-decoration-color** → ```"text-decoration-color: rgba(24, 126, 168);"```

  4. ⚠️ If you give **font-family** style, this style can overwrite **font-weight** and **font-style**.
      - font-family: **Nunito-ExtraLightItalic**; → this overwrite **font-weight** as normal.

**Kind**: inner constant of [<code>html-to-text</code>](#module_html-to-text)  
<a name="module_html-to-text..createAttributedTexts"></a>

### html-to-text~createAttributedTexts(htmlSource) ⇒ <code>Array.&lt;AttributedString&gt;</code>
This method automatically maps necessary attributedstring variables. Use this if you don't have Dark theme support or you want the attributedstrings as is.
Consider reading this documentation before passing an html: https://github.com/smartface/sf-extension-utils/blob/master/doc/html-to-text.md

**Kind**: inner method of [<code>html-to-text</code>](#module_html-to-text)  

| Param | Type | Description |
| --- | --- | --- |
| htmlSource | <code>string</code> | Your html content to work with. The limitations and rules are specified in the document of this module. |

**Example**  
```js
import TextView from 'sf-core/ui/textview';
import { createAttributedStrings } from "sf-extenstion-utils/lib/html-to-text");

const textView = new TextView();
const htmlSource = "<span style=\"font-size: 24px; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\"><span style=\"font-family: Nunito-LightItalic; font-size: 24px; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">Your </span><font face=\"ios-Default-Bold\" style=\"font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">attributed </font><span style=\"text-decoration-line: underline; color: rgb(139, 87, 42); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; text-decoration-color: rgb(0, 0, 0);\">Stri<span style=\"color: rgb(139, 87, 42); text-decoration-line: underline ; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent;\">ngs</span></span></span><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224);\">second</span></span></span></div><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 16px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224); color: rgb(248, 231, 28);\">Third</span></span></span></div>";
textView.attributedText = createAttributedTexts(htmlSource);
```
<a name="module_html-to-text..createAttributedStrings"></a>

### html-to-text~createAttributedStrings(htmlSource) ⇒ <code>Array.&lt;AttributedString&gt;</code>
This method returns half-baked attributedstring value. Use this method if you support dark theme to change foregroundColor or if you want to tweak other properties.
Consider reading this documentation before passing an html: https://github.com/smartface/sf-extension-utils/blob/master/doc/html-to-text.md

**Kind**: inner method of [<code>html-to-text</code>](#module_html-to-text)  

| Param | Type | Description |
| --- | --- | --- |
| htmlSource | <code>string</code> | Your html content to work with. The limitations and rules are specified in the document of this module. |

**Example**  
```js
import TextView from 'sf-core/ui/textview';
import { createAttributedStrings } from "sf-extenstion-utils/lib/html-to-text");
import AttributedString from "sf-core/ui/attributedstring";
import propFactory from "@smartface/contx/lib/smartface/sfCorePropFactory";

const textView = new TextView();
const htmlSource = "<span style=\"font-size: 24px; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\"><span style=\"font-family: Nunito-LightItalic; font-size: 24px; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">Your </span><font face=\"ios-Default-Bold\" style=\"font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">attributed </font><span style=\"text-decoration-line: underline; color: rgb(139, 87, 42); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; text-decoration-color: rgb(0, 0, 0);\">Stri<span style=\"color: rgb(139, 87, 42); text-decoration-line: underline ; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent;\">ngs</span></span></span><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224);\">second</span></span></span></div><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 16px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224); color: rgb(248, 231, 28);\">Third</span></span></span></div>";
const attributedStrings = createAttributedStrings(htmlSource);
textView.attributedText = attributedStrings.map(s => new AttributedString(propFactory(s))); // Or edit inside of map function
```
