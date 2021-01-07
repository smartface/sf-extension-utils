<a name="module_service-call"></a>

## service-call : <code>object</code>
Smartface Service-Call helper module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2019  

* [service-call](#module_service-call) : <code>object</code>
    * [~ServiceCall](#module_service-call..ServiceCall)
        * [new ServiceCall(options)](#new_module_service-call..ServiceCall_new)
        * _instance_
            * [.baseUrl](#module_service-call..ServiceCall+baseUrl)
            * [.setHeader(key, value, headers)](#module_service-call..ServiceCall+setHeader)
            * [.getHeaders()](#module_service-call..ServiceCall+getHeaders) ⇒ <code>object</code>
            * [.createRequestOptions(endpointPath, options)](#module_service-call..ServiceCall+createRequestOptions) ⇒ <code>object</code>
            * [.request(endpointPath, options)](#module_service-call..ServiceCall+request) ⇒ <code>Promise</code>
        * _static_
            * [.BASE_HEADERS](#module_service-call..ServiceCall.BASE_HEADERS)
            * [.request(options)](#module_service-call..ServiceCall.request) ⇒ <code>Promise</code>

<a name="module_service-call..ServiceCall"></a>

### service-call~ServiceCall
Helper class for calling JSON based restful services.

**Kind**: inner class of [<code>service-call</code>](#module_service-call)  
**Access**: public  

* [~ServiceCall](#module_service-call..ServiceCall)
    * [new ServiceCall(options)](#new_module_service-call..ServiceCall_new)
    * _instance_
        * [.baseUrl](#module_service-call..ServiceCall+baseUrl)
        * [.setHeader(key, value, headers)](#module_service-call..ServiceCall+setHeader)
        * [.getHeaders()](#module_service-call..ServiceCall+getHeaders) ⇒ <code>object</code>
        * [.createRequestOptions(endpointPath, options)](#module_service-call..ServiceCall+createRequestOptions) ⇒ <code>object</code>
        * [.request(endpointPath, options)](#module_service-call..ServiceCall+request) ⇒ <code>Promise</code>
    * _static_
        * [.BASE_HEADERS](#module_service-call..ServiceCall.BASE_HEADERS)
        * [.request(options)](#module_service-call..ServiceCall.request) ⇒ <code>Promise</code>

<a name="new_module_service-call..ServiceCall_new"></a>

#### new ServiceCall(options)
Creates a ServiceCall helper class with common configuration to be used across multiple service calls.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | Cofiguration of service call helper object (required) |
| options.baseUrl | <code>string</code> |  | Base URL of all future service calls (required) |
| [options.timeout] | <code>number</code> | <code>60000</code> | Timeout value for service calls. If not provided it uses the default timeout value from sf-core http |
| [options.logEnabled] | <code>boolean</code> | <code>false</code> | Logs the service requests & responses to console |
| [options.headers] | <code>object</code> |  | Sets the default headers for this configuration |

**Example**  
```js
// Shared service-call.js file
const ServiceCall = require("sf-extension-utils/lib/service-call");
const sc = new ServiceCall({
    baseUrl: "http://api.myBaseUrl.com",
    logEnabled: true,
    headers: {
       apiVersion: "1.0"
    }
});
module.exports = exports = sc;

// services/user.js
const sc = require("./serviceConfig");

Object.assign(exports, {
    login
});

 async function login(userName, password) {
     try {
         const response = await sc.request(`/auth/login?emine=3`, {
             method: "POST",
             body: {
                 userName,
                 password
             }
         });
         sc.setHeader("Authorization", "Bearer " + response.token);
         return response;
     }
     catch (err) {
         throw err;
     }
 }


// pages/pgLogin.js
const userService = require("../services/user");

page.btnLogin.onPress = () => {
     userService.login(page.tbUserName.text, page.tbPassword.text).then(()=> {
        Router.go("pgDashboard"); 
     }).catch(()=> {
         alert("Cannot login");
     });
};
```
<a name="module_service-call..ServiceCall+baseUrl"></a>

#### serviceCall.baseUrl
Base URL for this service-call library uses. This can be get and set

**Kind**: instance property of [<code>ServiceCall</code>](#module_service-call..ServiceCall)  
**Properties**

| Name | Type |
| --- | --- |
| baseUrl | <code>string</code> | 

<a name="module_service-call..ServiceCall+setHeader"></a>

#### serviceCall.setHeader(key, value, headers)
Sets headers for this configuration. Either sets one by each call or sets them in bulk

**Kind**: instance method of [<code>ServiceCall</code>](#module_service-call..ServiceCall)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Header name to set |
| value | <code>string</code> | Value to set of the key. If value is not a string, key is removed from header |
| headers | <code>object</code> | headers object to set multipe header values at once |

**Example**  
```js
//After login
sc.setHeader("Authorization", "Basic 12345");
```
**Example**  
```js
//After logout
sc.setHeader("Authorization");
```
**Example**  
```js
// set multiple headers at once
sc.setHeader({
 environment: "test",
 apiVersion: "1.2"  //replaces the existing
});
```
<a name="module_service-call..ServiceCall+getHeaders"></a>

#### serviceCall.getHeaders() ⇒ <code>object</code>
Gets a copy of headers used

**Kind**: instance method of [<code>ServiceCall</code>](#module_service-call..ServiceCall)  
**Returns**: <code>object</code> - headers  
<a name="module_service-call..ServiceCall+createRequestOptions"></a>

#### serviceCall.createRequestOptions(endpointPath, options) ⇒ <code>object</code>
creates a request options object for http request

**Kind**: instance method of [<code>ServiceCall</code>](#module_service-call..ServiceCall)  
**Returns**: <code>object</code> - http request object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| endpointPath | <code>string</code> |  | Added to the end of the base url to form the url |
| options | <code>object</code> |  | Request specific options |
| [options.method] | <code>string</code> |  | HTTP method of this request |
| [options.body] | <code>object</code> |  | Request payload body. This object will be automatically stringified |
| [options.q] | <code>object</code> |  | Query string string object. Combines with the url |
| [options.query] | <code>object</code> |  | Alias for options.q |
| [options.headers] | <code>object</code> |  | Request specific headers. In conflict with configuration, those values are used |
| [options.logEnabled] | <code>boolean</code> |  | Request specific log option |
| [options.user] | <code>string</code> |  | Basic authentication user. Must be used with options.password |
| [options.password] | <code>string</code> |  | Basic authentication password. Must be used with options.user |
| [options.fullResponse] | <code>boolean</code> | <code>false</code> | Resolved promise contains full response including `headers`, `body` and `status` |

**Example**  
```js
var reqOps = sc.createRequestOptions(`/auth/login`, {
       method: "POST",
       body: {
           userName,
           password
       },
       headers: {
           "Content-Type": "application/json"
       }
   });
   ServiceCall.request(reqOps).then((result) => {
       //logic
   }).catch((err) => {
       //logic
   });
```
<a name="module_service-call..ServiceCall+request"></a>

#### serviceCall.request(endpointPath, options) ⇒ <code>Promise</code>
Combines serviceCall.createRequestOptions and ServiceCall.request (static)

**Kind**: instance method of [<code>ServiceCall</code>](#module_service-call..ServiceCall)  
**See**

- ServiceCall.createRequestOptions
- ServiceCall.request


| Param | Type | Description |
| --- | --- | --- |
| endpointPath | <code>string</code> | Added to the end of the base url to form the url |
| options | <code>object</code> | Request specific options |
| [options.method] | <code>string</code> | HTTP method of this request |
| [options.body] | <code>object</code> | Request payload body. This object will be automatically stringified |
| [options.q] | <code>object</code> | Query string string object. Combines with the url |
| [options.query] | <code>object</code> | Alias for options.q |
| [options.headers] | <code>object</code> | Request specific headers. In conflict with configuration, those values are used |
| [options.logEnabled] | <code>boolean</code> | Request specific log option |
| [options.user] | <code>string</code> | Basic authentication user. Must be used with options.password |
| [options.password] | <code>string</code> | Basic authentication password. Must be used with options.user |

**Example**  
```js
function login(userName, password) {
     return sc.request("/auth/login", {
         method: "POST",
         body: {
             userName,
             password
         }
     });
 }
```
<a name="module_service-call..ServiceCall.BASE_HEADERS"></a>

#### ServiceCall.BASE\_HEADERS
Default values of headers

**Kind**: static property of [<code>ServiceCall</code>](#module_service-call..ServiceCall)  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| header | <code>object</code> | object |

<a name="module_service-call..ServiceCall.request"></a>

#### ServiceCall.request(options) ⇒ <code>Promise</code>
Performs a service call and returns a promise to handle

**Kind**: static method of [<code>ServiceCall</code>](#module_service-call..ServiceCall)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | Request specific options |
| options.method | <code>string</code> |  | HTTP method of this request |
| options.url | <code>string</code> |  | Full Http url |
| [options.body] | <code>object</code> |  | Request payload body. This object will be automatically stringified |
| [options.headers] | <code>object</code> |  | Full request headers |
| [options.logEnabled] | <code>boolean</code> |  | Request specific log option |
| [options.user] | <code>string</code> |  | Basic authentication user. Must be used with options.password |
| [options.password] | <code>string</code> |  | Basic authentication password. Must be used with options.user |
| [options.fullResponse] | <code>boolean</code> | <code>false</code> | Resolved promise contains full response including `headers`, `body` and `status` |

**Example**  
```js
var reqOps = sc.createRequestOptions(`/auth/login`, {
       method: "POST",
       body: {
           userName,
           password
       },
       headers: {
           "Content-Type": "application/json"
       }
   });
   ServiceCall.request(reqOps).then((result) => {
       //logic
   }).catch((err) => {
       //logic
   });
```
