<a name="module_async"></a>

## async : <code>object</code>
Button & ActivityIndicator helper module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  

* [async](#module_async) : <code>object</code>
    * [~createAsyncGetter(task, [options])](#module_async..createAsyncGetter) ⇒ <code>async~getter</code>
    * [~getter()](#module_async..getter) ⇒ <code>Promise</code>
    * [~createAsyncTask(task, [options])](#module_async..createAsyncTask) ⇒ <code>Promise</code>

<a name="module_async..createAsyncGetter"></a>

### async~createAsyncGetter(task, [options]) ⇒ <code>async~getter</code>
Returns a getter function, which returns the promise of the asyc task.

**Kind**: inner method of [<code>async</code>](#module_async)  
**Returns**: <code>async~getter</code> - a function which returns promise  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| task | <code>function</code> |  | is called as AsyncTask. Make sure that no UI operation takes place. Return value of the task function is used as the resolved argument |
| [options] | <code>object</code> | <code>{}</code> | Options object |
| [options.forceSynch] | <code>boolean</code> | <code>false</code> | Calls the function direclty without async task |
| [options.thisObject] | <code>object</code> | <code>global</code> | `this` keyword for the function to be callled |

**Example**  
```js
const { createAsyncGetter } = require("sf-extension-utils/lib/async");
const { OS } = require('sf-core/device/system');


getLibphonenumber = createAsyncGetter(() => {
    let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    let PNT = require('google-libphonenumber').PhoneNumberType;
    let PNF = require('google-libphonenumber').PhoneNumberFormat;
    return {
        phoneUtil,
        PNT,
        PNF
    };
}, {
    forceSynch: OS === "iOS"
});

//using the promise function
tbPhone.onTextChanged = function(e) {
    getLibphonenumber().then(({ phoneUtil, PNT }) => {
        var phoneNumber = phoneUtil.parse(tbPhone.text, phoneUtilCountryCode);
        var isValid = phoneUtil.isValidNumber(phoneNumber) &&
            phoneUtil.getNumberType(phoneNumber) === PNT.MOBILE;
    });
};
```
<a name="module_async..getter"></a>

### async~getter() ⇒ <code>Promise</code>
Getter function for createAsyncGetter. Calling the getter will not trigger the async task to run. Puts the requests in que and responds when the task is done. If the task is already resolved, automatically resolves the promise. Any exceptions for the task causes rejection.

**Kind**: inner method of [<code>async</code>](#module_async)  
**Returns**: <code>Promise</code> - Promise is resolved when the task is finished  
**Internal**:   
<a name="module_async..createAsyncTask"></a>

### async~createAsyncTask(task, [options]) ⇒ <code>Promise</code>
Runs the async task and responds a promise

**Kind**: inner method of [<code>async</code>](#module_async)  
**Returns**: <code>Promise</code> - when resolved return value of the task is provided  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| task | <code>function</code> |  | is called as AsyncTask. Make sure that no UI operation takes place. Return value of the task function is used as the resolved argument |
| [options] | <code>object</code> | <code>{}</code> | Options object |
| [options.forceSynch] | <code>boolean</code> | <code>false</code> | Calls the function direclty without async task |
| [options.thisObject] | <code>object</code> | <code>global</code> | `this` keyword for the function to be callled |

**Example**  
```js
const { createAsyncTask } = require("sf-extension-utils/lib/async");
const Http = require("sf-core/net/http");
createAsyncTask(()=> new Http()).then(http => http.request(requestOptions));
```
