<a name="module_googlesafetynet"></a>

## googlesafetynet : <code>object</code>
Smartface GoogleSafetyNet Android Module

**Author**: Muhammed Yalcin Kuru <yalcin.kuru@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2019  

* [googlesafetynet](#module_googlesafetynet) : <code>object</code>
    * _instance_
        * [.generateNonce()](#module_googlesafetynet+generateNonce) ⇒ <code>string</code>
        * [.isPlayServicesAvailable()](#module_googlesafetynet+isPlayServicesAvailable) ⇒ <code>boolean</code>
    * _inner_
        * [~GoogleSafetyNet](#module_googlesafetynet..GoogleSafetyNet)
            * [new GoogleSafetyNet(options)](#new_module_googlesafetynet..GoogleSafetyNet_new)
            * [.sendAttestationRequest(nonce)](#module_googlesafetynet..GoogleSafetyNet+sendAttestationRequest) ⇒ <code>Promise</code>

<a name="module_googlesafetynet+generateNonce"></a>

### googlesafetynet.generateNonce() ⇒ <code>string</code>
Generates random strings.

**Kind**: instance method of [<code>googlesafetynet</code>](#module_googlesafetynet)  
**Returns**: <code>string</code> - - returns converted UTF-8 string from random generated 16 bytes.  
**Access**: public  
**Example**  
```js
let nonce = googleSafetyNet.generateNonce();
```
<a name="module_googlesafetynet+isPlayServicesAvailable"></a>

### googlesafetynet.isPlayServicesAvailable() ⇒ <code>boolean</code>
Checks google play services availability.

**Kind**: instance method of [<code>googlesafetynet</code>](#module_googlesafetynet)  
**Returns**: <code>boolean</code> - - returns either google play services available currently or not.  
**Access**: public  
**Example**  
```js
let isPlayServicesAvailable = googleSafetyNet.isPlayServicesAvailable();
```
<a name="module_googlesafetynet..GoogleSafetyNet"></a>

### googlesafetynet~GoogleSafetyNet
Helper class for Google's SafetyNet. SafetyNet provides a set of services and 
APIs that help protect your app against security threats, including device 
tampering, bad URLs, potentially harmful apps, and fake users.

**Kind**: inner class of [<code>googlesafetynet</code>](#module_googlesafetynet)  
**Access**: public  
**See**: [https://developer.android.com/training/safetynet/attestation.html](https://developer.android.com/training/safetynet/attestation.html)  

* [~GoogleSafetyNet](#module_googlesafetynet..GoogleSafetyNet)
    * [new GoogleSafetyNet(options)](#new_module_googlesafetynet..GoogleSafetyNet_new)
    * [.sendAttestationRequest(nonce)](#module_googlesafetynet..GoogleSafetyNet+sendAttestationRequest) ⇒ <code>Promise</code>

<a name="new_module_googlesafetynet..GoogleSafetyNet_new"></a>

#### new GoogleSafetyNet(options)
Creates a GoogleSafetyNet class with given configurations.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Cofiguration of GoogleSafetyNet helper object (required) |
| options.apiKey | <code>string</code> | API key from Google APIs (required).  <a href="https://developer.android.com/training/safetynet/attestation#obtain-api-key">See here</a> |

**Example**  
```js
const GoogleSafetyNet = require("sf-extension-utils/lib/security/googlesafetynet");
if (System.OS === "Android") {
    const googleSafetyNet = new GoogleSafetyNet({
        apiKey: "***********"
    });
    if (googleSafetyNet.isPlayServicesAvailable()) {
        let nonce = googleSafetyNet.generateNonce();
        // Nonce should be at least 16 bytes length
        googleSafetyNet.sendAttestationRequest(nonce)
            .then(jws => {
                console.info(`JWS ${jws}`);
            })
            .catch(e => {
                console.error(e);
            });
    }
    else {
        console.info("Google Play services are not available. You cannot proceed further");
    }
}
```
<a name="module_googlesafetynet..GoogleSafetyNet+sendAttestationRequest"></a>

#### googleSafetyNet.sendAttestationRequest(nonce) ⇒ <code>Promise</code>
Sends the runtime environment and request a signed attestation of the 
assessment results from Google's servers and then resolves the returned 
assessment result as JWS string. In case of Google backend services 
are not available reject the request. 

<pre>
//JWS example
<code>
{
   "timestampMs": 9860437986543,
   "nonce": "R2Rra24fVm5xa2Mg",
   "apkPackageName": "com.package.name.of.requesting.app",
   "apkCertificateDigestSha256": ["base64 encoded, SHA-256 hash of the
                                   certificate used to sign requesting app"],
   "ctsProfileMatch": true,
   "basicIntegrity": true,
 }
</code>
A signed attestation's payload typically contains the following fields:

<b>apkCertificateDigestSha256</b>: Base-64 encoded representation(s) of 
the SHA-256 hash of the calling app's signing certificate(s)
<b>apkPackageName</b>: The calling app's package name.
<b>nonce</b>: The single-use token that the calling app passes to the API.
<b>timestampMs</b>: Milliseconds past the UNIX epoch when the JWS response 
message was generated by Google's servers.
<b>ctsProfileMatch</b>: A stricter verdict of device integrity. If the value 
of ctsProfileMatch is true, then the profile of the device running your app 
matches the profile of a device that has passed Android compatibility testing.
<b>basicIntegrity</b>: A more lenient verdict of device integrity. If only 
the value of basicIntegrity is true, then the device running your app likely 
wasn't tampered with. However, the device hasn't necessarily passed Android 
compatibility testing.

You should trust the APK information only if the value of ctsProfileMatch 
is true. So to validate device is trusted, check JWS's ctsProfileMatch & 
basicIntegrity boolean variables. Google has a table
to show how device status could affect the values of basicIntegrity and 
ctsProfileMatch. <a href="https://developer.android.com/training/safetynet/attestation#potential-integrity-verdicts">See here</a> 

Note: Do not validate these two variables in source code if the code can 
be accessed by reverse-engineering 

</pre>

**Kind**: instance method of [<code>GoogleSafetyNet</code>](#module_googlesafetynet..GoogleSafetyNet)  
**Returns**: <code>Promise</code> - resolved with JWS and rejected with error message.  
**Access**: public  
**See**: [https://developer.android.com/training/safetynet/attestation.html](https://developer.android.com/training/safetynet/attestation.html)  

| Param | Type | Description |
| --- | --- | --- |
| nonce | <code>string</code> | Unique identifier for validation of returned JWS. |

**Example**  
```js
if (System.OS === "Android") {
    sendAttestationRequest("a2d0sa1@3sqwe123f12sww")
        .then(jws => {
            console.log(`JWS ${jws}`);
        })
        .catch(e => {
            console.error(e);
        });
}
```
