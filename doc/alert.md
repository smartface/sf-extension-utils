<a name="module_alert"></a>

## alert : <code>object</code>
Smartface global alert replacer

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2017  

* [alert](#module_alert) : <code>object</code>
    * [~alert(options, title)](#module_alert..alert) ⇒ <code>UI.AlertView</code>
    * [~AlertButton](#module_alert..AlertButton) : <code>object</code>

<a name="module_alert..alert"></a>

### alert~alert(options, title) ⇒ <code>UI.AlertView</code>
Creates a new AlertView instance and automatically shows it

**Kind**: inner method of [<code>alert</code>](#module_alert)  
**Returns**: <code>UI.AlertView</code> - created AlertView object  
**See**

- [AlertView Guide](https://developer.smartface.io/docs/alertview)
- [Button Types](http://ref.smartface.io/#!/api/UI.AlertView.Android.ButtonType)


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> \| <code>string</code> | is the alert options or the string to display as message. If object is used, it is automatically passed as constructor to the AlertView |
| options.message | <code>string</code> | sets message of AlertView |
| options.title | <code>string</code> | sets title of AlertView |
| options.buttons | <code>Array.&lt;AlertButton&gt;</code> | shows OK if omited |
| title | <code>string</code> | optinal title |

**Example**  
```js
alert("Hello World!");
```
**Example**  
```js
alert("message", "title");
```
**Example**  
```js
alert({
 message: "message",
 title: "title" //optional
});
```
**Example**  
```js
alert({
 message: "Would you like to answer?"
 title: "Question", //optional
 buttons: [
     {
         text: "Yes",
         type: AlertView.Android.ButtonType.POSITIVE,
         onClick: function() { 
             //handle yes answer here
         },
     },
     {
         text: "No",
         type: AlertView.Android.ButtonType.NEGATIVE,
         onClick: function() { 
             //handle no answer here
         },
     }
 ]});
```
**Example**  
```js
var alertView = alert({message:"this is an alert", buttons: []}); //alert without buttons
setTimeout(function(){alertView.dismiss();}, 2000); //closes the alert after 2 seconds
```
<a name="module_alert..AlertButton"></a>

### alert~AlertButton : <code>object</code>
**Kind**: inner typedef of [<code>alert</code>](#module_alert)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>UI.AlertView.Android.ButtonType</code> | Button type, it is set to UI.AlertView.Android.ButtonType.NEUTRAL as default |
| text | <code>string</code> | Button text. It's letter case behaves differently on the platforms |
| onClick | <code>function</code> | Callback for button click action |

