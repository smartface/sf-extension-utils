<a name="module_service-call-offline"></a>

## service-call-offline : <code>object</code>
Smartface Service-Call-Offline module.
This module provides classes to be instead of ServiceCall class for some offline capability.

Requiring this module creates a database file under DataDirectory named as service-call.sqlite

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2019  

* [service-call-offline](#module_service-call-offline) : <code>object</code>
    * [~OfflineRequestServiceCall](#module_service-call-offline..OfflineRequestServiceCall) ⇐ <code>ServiceCall</code>
        * [new OfflineRequestServiceCall(offlineRequestHandler)](#new_module_service-call-offline..OfflineRequestServiceCall_new)
        * [.sendAll()](#module_service-call-offline..OfflineRequestServiceCall.sendAll) ⇒ <code>Promise</code>
    * [~OfflineResponseServiceCall](#module_service-call-offline..OfflineResponseServiceCall) ⇐ <code>ServiceCall</code>
        * [new OfflineResponseServiceCall(requestCleaner, serveFrom)](#new_module_service-call-offline..OfflineResponseServiceCall_new)
    * [~clearOfflineDatabase()](#module_service-call-offline..clearOfflineDatabase)
    * [~closeOfflineDatabase()](#module_service-call-offline..closeOfflineDatabase)

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

#### new OfflineResponseServiceCall(requestCleaner, serveFrom)
Creates an OfflineResponseServiceCall helper class


| Param | Type | Description |
| --- | --- | --- |
| requestCleaner | <code>function</code> | Returns modified request options |
| serveFrom | <code>string</code> | - If "DB" is given, response is served from DB  then request is made to update the DB. - If "API" is given, request is made,  DB is updated with the response then the response is served. - If no network  connection is avaliable, response is served from DB either way. |

**Example**  
```js
const { OfflineResponseServiceCall } = require("sf-extension-utils/lib/service-call-offline");
sc = sc || new OfflineResponseServiceCall({
    baseUrl: "http://smartface.io",
    logEnabled: true,
    serveFrom: "DB", // "API"
    requestCleaner: requestOptions => {
        delete requestOptions.headers;
        return requestOptions;
    }
});     
```
<a name="module_service-call-offline..clearOfflineDatabase"></a>

### service-call-offline~clearOfflineDatabase()
Drops all tables from offline database

**Kind**: inner method of [<code>service-call-offline</code>](#module_service-call-offline)  
<a name="module_service-call-offline..closeOfflineDatabase"></a>

### service-call-offline~closeOfflineDatabase()
Closes offline database, must be called right before application exits

**Kind**: inner method of [<code>service-call-offline</code>](#module_service-call-offline)  
