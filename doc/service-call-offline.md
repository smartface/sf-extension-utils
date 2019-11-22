<a name="module_service-call-offline"></a>

## service-call-offline : <code>object</code>
Smartface Service-Call-Offline module.
This module provides classes to be instead of ServiceCall class for some offline capability.

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2019  

* [service-call-offline](#module_service-call-offline) : <code>object</code>
    * _static_
        * [.service-call-offline:init(options)](#module_service-call-offline.service-call-offline_init)
    * _inner_
        * [~OfflineRequestServiceCall](#module_service-call-offline..OfflineRequestServiceCall) ⇐ <code>ServiceCall</code>
            * [new OfflineRequestServiceCall(offlineRequestHandler)](#new_module_service-call-offline..OfflineRequestServiceCall_new)
            * [.sendAll()](#module_service-call-offline..OfflineRequestServiceCall.sendAll) ⇒ <code>Promise</code>
        * [~OfflineResponseServiceCall](#module_service-call-offline..OfflineResponseServiceCall) ⇐ <code>ServiceCall</code>
            * [new OfflineResponseServiceCall(requestCleaner)](#new_module_service-call-offline..OfflineResponseServiceCall_new)

<a name="module_service-call-offline.service-call-offline_init"></a>

### service-call-offline.service-call-offline:init(options)
Configures service-call-offline. Call this in your app once before using any functionality.

**Kind**: static method of [<code>service-call-offline</code>](#module_service-call-offline)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | configuration options |
| [options.encryptionFunction] | <code>fingerprint:CryptopgyFunction</code> | stored data is encrypted with the given function |
| [options.decryptionFunction] | <code>fingerprint:CryptopgyFunction</code> | stored data is decrypted with the given function |

**Example**  
```js
const { init } = require("sf-extension-utils/lib/service-call-offline");
const Blob = require('sf-core/blob');

const basicEncrypt = plainData => {
    let b = Blob.createFromUTF8String(plainData);
    let encryptedData = b.toBase64();
    return encryptedData;
};

const basicDecrypt = encryptedData => {
    let b = Blob.createFromBase64(encryptedData);
    let decryptedData = b.toString();
    return decryptedData;
};

// It is recommended this to be called in app.js:
init({
    encryptionFunction: basicEncrypt,
    decryptionFunction: basicDecrypt
});
```
<a name="module_service-call-offline..OfflineRequestServiceCall"></a>

### service-call-offline~OfflineRequestServiceCall ⇐ <code>ServiceCall</code>
**Kind**: inner class of [<code>service-call-offline</code>](#module_service-call-offline)  
**Extends**: <code>ServiceCall</code>  

* [~OfflineRequestServiceCall](#module_service-call-offline..OfflineRequestServiceCall) ⇐ <code>ServiceCall</code>
    * [new OfflineRequestServiceCall(offlineRequestHandler)](#new_module_service-call-offline..OfflineRequestServiceCall_new)
    * [.sendAll()](#module_service-call-offline..OfflineRequestServiceCall.sendAll) ⇒ <code>Promise</code>

<a name="new_module_service-call-offline..OfflineRequestServiceCall_new"></a>

#### new OfflineRequestServiceCall(offlineRequestHandler)
Creates an OfflineRequestServiceCall helper class
If there's no network connection, saves the request to perform later when 
network connection is available


| Param | Type | Description |
| --- | --- | --- |
| offlineRequestHandler | <code>function</code> | Gets request options to be modified  when network connection is available and returns a promise |

**Example**  
```js
const { OfflineRequestServiceCall } = require("sf-extension-utils/lib/service-call-offline");
sc = new OfflineRequestServiceCall({
    baseUrl: "http://smartface.io",
    logEnabled: true,
    offlineRequestHandler: requestOptions => {
        return new Promise((resolve, reject) => {
            amce.createRequestOptions(amceOptions)
                .then(({ headers }) => {
                    resolve(Object.assign({}, requestOptions, headers));
                });
        });
    }
});
```
<a name="module_service-call-offline..OfflineRequestServiceCall.sendAll"></a>

#### OfflineRequestServiceCall.sendAll() ⇒ <code>Promise</code>
Perform all pending requests in DB

**Kind**: static method of [<code>OfflineRequestServiceCall</code>](#module_service-call-offline..OfflineRequestServiceCall)  
<a name="module_service-call-offline..OfflineResponseServiceCall"></a>

### service-call-offline~OfflineResponseServiceCall ⇐ <code>ServiceCall</code>
**Kind**: inner class of [<code>service-call-offline</code>](#module_service-call-offline)  
**Extends**: <code>ServiceCall</code>  
<a name="new_module_service-call-offline..OfflineResponseServiceCall_new"></a>

#### new OfflineResponseServiceCall(requestCleaner)
Creates an OfflineResponseServiceCall helper class
Response is served from DB then request is made to update the DB


| Param | Type | Description |
| --- | --- | --- |
| requestCleaner | <code>function</code> | Returns modified request options |

**Example**  
```js
const { OfflineResponseServiceCall } = require("sf-extension-utils/lib/service-call-offline");
sc = sc || new OfflineResponseServiceCall({
    baseUrl: "http://smartface.io",
    logEnabled: true,
    requestCleaner: requestOptions => {
        delete requestOptions.headers;
        return requestOptions;
    }
});     
```
