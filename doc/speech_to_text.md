<a name="module_speechToText"></a>

## speechToText : <code>object</code>
Smartface Speech to Text util module

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2017  

* [speechToText](#module_speechToText) : <code>object</code>
    * _static_
        * [.isRunning](#module_speechToText.isRunning)
        * [.speechToText:startType(textBox, [timeout], onStop)](#module_speechToText.speechToText_startType)
        * [.stop()](#module_speechToText.stop)
    * _inner_
        * [~speechToText:startTypeCallback](#module_speechToText..speechToText_startTypeCallback) : <code>function</code>

<a name="module_speechToText.isRunning"></a>

### speechToText.isRunning
State for Speech2TextUtil. If is timeout or error occurred, isRunning will became false.

**Kind**: static property of [<code>speechToText</code>](#module_speechToText)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type |
| --- | --- |
| speechToText:isRunning | <code>boolean</code> | 

<a name="module_speechToText.speechToText_startType"></a>

### speechToText.speechToText:startType(textBox, [timeout], onStop)
Starts listening user and write it to textBox that given as paramater.
When SpeecRecognizer stops onStop will be triggered. If there is an exception
occurs, onStop will be triggered with "error" parameter.
For android, methods checks permissions automatically.

**Kind**: static method of [<code>speechToText</code>](#module_speechToText)  
**Access**: public  
**See**: [Speech Recognizer guide](https://developer.smartface.io/docs/speechrecognizer)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| textBox | <code>UI.TextBox</code> \| <code>UI.TextArea</code> \| <code>UI.Label</code> |  | object set the text to |
| [timeout] | <code>Number</code> | <code>3000</code> | stops speech recognition after given time |
| onStop | <code>speechToText:startTypeCallback</code> |  |  |

**Example**  
```js
const speechToText = require("sf-extension-utils").speechToText;
speechToText.startType(myTextBoxInput,4000);
```
<a name="module_speechToText.stop"></a>

### speechToText.stop()
Stops a running Speech Recognizer
* @function speechToText:stop

**Kind**: static method of [<code>speechToText</code>](#module_speechToText)  
**Access**: public  
<a name="module_speechToText..speechToText_startTypeCallback"></a>

### speechToText~speechToText:startTypeCallback : <code>function</code>
**Kind**: inner typedef of [<code>speechToText</code>](#module_speechToText)  

| Param | Type |
| --- | --- |
| error | <code>SpeechRecognizer.Error</code> | 

