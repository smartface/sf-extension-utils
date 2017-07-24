## Classes

<dl>
<dt><a href="#FingerPrintUtil">FingerPrintUtil</a></dt>
<dd></dd>
<dt><a href="#RauUtil">RauUtil</a></dt>
<dd></dd>
<dt><a href="#PermissionUtil">PermissionUtil</a></dt>
<dd></dd>
<dt><a href="#Speech2TextUtil">Speech2TextUtil</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#isUserRejectedFingerprint">isUserRejectedFingerprint</a></dt>
<dd><p>Check user rejected fingerprint. When you call <a href="FingerPrintUtil#registerFingerPrint">FingerPrintUtil#registerFingerPrint</a> 
it shows confirmation dialog to user for usage about fingerprint. When user rejected it
by clicking &quot;Cancel&quot; on that dialog this variable becomes true.</p>
</dd>
<dt><a href="#isUserVerifiedFingerprint">isUserVerifiedFingerprint</a></dt>
<dd><p>Check user could verified fingerprint. When you call <a href="FingerPrintUtil#registerFingerPrint">FingerPrintUtil#registerFingerPrint</a> 
it shows fingerprint dialog after confirmation dialog. When user&#39;s fingerprint verified by system,
this variable becomes true.</p>
</dd>
<dt><a href="#isUserAllowedFingerprint">isUserAllowedFingerprint</a></dt>
<dd><p>Check user allowed fingerprint. When you call <a href="FingerPrintUtil#registerFingerPrint">FingerPrintUtil#registerFingerPrint</a> 
it shows confirmation dialog to user for usage about fingerprint. When user allowed it
by clicking &quot;Okay&quot; on that dialog this variable becomes true.</p>
</dd>
<dt><a href="#isFingerprintAvailable">isFingerprintAvailable</a></dt>
<dd><p>Check device supports fingerprint (Android) or TouchID for iOS. This variables reflects <a href="Device.System#fingerPrintAvailable">Device.System#fingerPrintAvailable</a></p>
</dd>
</dl>

<a name="FingerPrintUtil"></a>

## FingerPrintUtil
**Kind**: global class  
**Since**: 1.1.3

An util class for Fingerprint operations.  
<a name="RauUtil"></a>

## RauUtil
**Kind**: global class  
**Since**: 1.0.0

An util class for RAU operations.  
<a name="PermissionUtil"></a>

## PermissionUtil
**Kind**: global class  
**Since**: 1.1.3

An util class for permissions operations. This util will work for iOS too.  
<a name="Speech2TextUtil"></a>

## Speech2TextUtil
**Kind**: global class  
**Since**: 1.1.3

An util class for Speech2Text operations.  
<a name="isUserRejectedFingerprint"></a>

## isUserRejectedFingerprint
Check user rejected fingerprint. When you call [FingerPrintUtil#registerFingerPrint](FingerPrintUtil#registerFingerPrint) 
it shows confirmation dialog to user for usage about fingerprint. When user rejected it
by clicking "Cancel" on that dialog this variable becomes true.

**Kind**: global variable  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.0  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| isUserRejectedFingerprint | <code>Boolean</code> | <code>false</code> | 

<a name="isUserVerifiedFingerprint"></a>

## isUserVerifiedFingerprint
Check user could verified fingerprint. When you call [FingerPrintUtil#registerFingerPrint](FingerPrintUtil#registerFingerPrint) 
it shows fingerprint dialog after confirmation dialog. When user's fingerprint verified by system,
this variable becomes true.

**Kind**: global variable  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.0  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| isUserVerifiedFingerprint | <code>Boolean</code> | <code>false</code> | 

<a name="isUserAllowedFingerprint"></a>

## isUserAllowedFingerprint
Check user allowed fingerprint. When you call [FingerPrintUtil#registerFingerPrint](FingerPrintUtil#registerFingerPrint) 
it shows confirmation dialog to user for usage about fingerprint. When user allowed it
by clicking "Okay" on that dialog this variable becomes true.

**Kind**: global variable  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.0  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| isUserAllowedFingerprint | <code>Boolean</code> | <code>false</code> | 

<a name="isFingerprintAvailable"></a>

## isFingerprintAvailable
Check device supports fingerprint (Android) or TouchID for iOS. This variables reflects [Device.System#fingerPrintAvailable](Device.System#fingerPrintAvailable)

**Kind**: global variable  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.0  
**Properties**

| Name | Type |
| --- | --- |
| isFingerprintAvailable | <code>Boolean</code> | 

<a name="registerFingerPrint"></a>

## .registerFingerPrint(onSuccess, onFailure)
Registers user to the fingerprint authentication. This function asks user that user want to use fingerprint for 
next login and if user wants by clicking "Okay" on "Finger Print Access" dialog, this method calls [Device.System#validateFingerPrint](Device.System#validateFingerPrint).
If fingerprint is not available, user rejected fingerprint, user rejected fingerprint by clicking "cancel" on 
"Finger Print Access" dialog or user cannot validate fingerprint with fingerprint dialog onFailure callback 
will be tiggered.

**Kind**: static function  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.0  

| Param | Type |
| --- | --- |
| onSuccess | <code>function</code> | 
| onFailure | <code>function</code> | 

<a name="validateFingerPrint"></a>

## .validateFingerPrint(onSuccess, onFailure)
Validates user to the fingerprint authentication. This method calls [Device.System#validateFingerPrint](Device.System#validateFingerPrint).
If fingerprint is not available, user rejected fingerprint or user cannot validate fingerprint with fingerprint dialog onFailure callback 
will be tiggered.

**Kind**: static function  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.0  

| Param | Type |
| --- | --- |
| onSuccess | <code>function</code> | 
| onFailure | <code>function</code> | 

<a name="reset"></a>

## .reset()
Reset saved state about fingerprint.

**Kind**: static function  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.1  
<a name="checkUpdate"></a>

## .checkUpdate(options)
Checks RAU updates. If there is new update available, the update dialog will be shown to the user 
if silent parameter not given. This function will handle permission operations internally for Android.

**Kind**: static function  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.showProgressCheck | <code>Boolean</code> | Show dialog while checking updates. |
| options.showProgressErrorAlert | <code>Boolean</code> | Show error dialog when error accurs. |
| options.silent | <code>Boolean</code> | Update and restart without interacting with user. |

<a name="applyPermission"></a>

## .applyPermission(permission, callback)
Check permission and request permission if needed for Android. 
Callback will be triggered with boolean variables that indicates grant status.
For iOS, callback will be triggered with true.

**Kind**: static function  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.0  

| Param | Type |
| --- | --- |
| permission | <code>String</code> | 
| callback | <code>function</code> | 
| callback.result | <code>Boolean</code> | 

<a name="startType"></a>

## .startType(textBox, [delay], onStop)
Starts listening user and write it to textBox that given as paramater.
When SpeecRecognizer stops onStop will be triggered. If there is an exception
occurs, onStop will be triggered with "error" parameter.
For android, methods checks permissions automatically.

**Kind**: static function  
**Read only**: true  
**Android**:   
**Ios**:   
**Since**: 1.0.0  

| Param | Type | Default |
| --- | --- | --- |
| textBox | <code>UI.TextBox</code> |  | 
| [delay] | <code>Number</code> | <code>3000</code> | 
| onStop | <code>function</code> |  | 
| onStop.error | <code>Object</code> |  | 

