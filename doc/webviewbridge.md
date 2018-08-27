<a name="module_WebViewBridge"></a>

## WebViewBridge : <code>function</code>
Smartface WebView Bridge for bidirectional communication

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2018  

* [WebViewBridge](#module_WebViewBridge) : <code>function</code>
    * [~WebViewBridge](#module_WebViewBridge..WebViewBridge) ⇐ <code>EventEmitter</code>
        * [new WebViewBridge(options, [parseResponses], [bounceEnabled])](#new_module_WebViewBridge..WebViewBridge_new)
    * [~webView](#module_WebViewBridge..webView)
    * [~loadedScriptNames](#module_WebViewBridge..loadedScriptNames)
    * [~source](#module_WebViewBridge..source)
    * [~parseResponses](#module_WebViewBridge..parseResponses)
    * [~delay](#module_WebViewBridge..delay)
    * [~lastURL](#module_WebViewBridge..lastURL)
    * [~ready()](#module_WebViewBridge..ready) ⇒ <code>Promise</code>
    * [~loadScripts()](#module_WebViewBridge..loadScripts) ⇒ <code>Promise</code>
    * [~refresh()](#module_WebViewBridge..refresh)
    * [~evaluateJS()](#module_WebViewBridge..evaluateJS)
    * [~customNavigate(options)](#module_WebViewBridge..customNavigate)

<a name="module_WebViewBridge..WebViewBridge"></a>

### WebViewBridge~WebViewBridge ⇐ <code>EventEmitter</code>
**Kind**: inner class of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Extends**: <code>EventEmitter</code>  
**Access**: public  
<a name="new_module_WebViewBridge..WebViewBridge_new"></a>

#### new WebViewBridge(options, [parseResponses], [bounceEnabled])
WebViewBridge is used for bi-directional communication with WebView. Events from WebView are captured with [EventEmiter](https://www.npmjs.com/package/wolfy87-eventemitter)<br />
This bridge creates window.**boubleEvent** function inside WebPage of the WebView<br />
boubleEvent - Has two arguments: **eventName** (required), **data** (optional)<br />
Data is JSON.stringify'ied transfered to Smartface over URI with the designated URI scheme (msg is default). data of the event is object parsed form of the stringified data from WebView<br />
It is possible to load additional scripts with **loadScripts** method of the WebViewBridge<br />
Use WebViewBridge.**on** or WebViewBridge.**once** methods to capture the calls of window.boubleEvent calls from WebPage with given eventName<br />
Following eventNames are reserved for WebViewBridge internal usage: "addScript", "scriptLoaded", "window.onload"
The inserted code is also setting the window.onload event of the WebPage

For using the EventEmitter pattern, the default events of the WebView are given without the "on" prefix, starting with lowercase. Such as onChangedURL becomes "changedURL".
For the onChangedURL event on Smartface can have a return value that specifies to continue with navigation or not. This is achieved with setting the "continue" property of the eventArgument.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | base options object |
| [options.webView] | <code>UI.WebView</code> | <code>new WebView()</code> | If not provided, it creates a new empty WebView instance. onChangedURL and onShow events of the WebView are set. Those event can be captured via .on("show", fn...) .on("changedURL", fn...) |
| [options.scheme] | <code>string</code> | <code>&quot;msg&quot;</code> | URI scheme in webView to communicate with webview |
| [options.source] | <code>string</code> \| <code>IO.File</code> |  | source to inject bridge code |
| [parseResponses] | <code>boolean</code> | <code>false</code> | when false, the WebView.evaluateJS runs faster without parsing the executed JS code response |
| [bounceEnabled] | <code>boolean</code> | <code>false</code> | when false bounce effect of the WebView is disabled |

**Example**  
```js
//Bridge Creation with AM-Charts
const WebViewBridge = require("sf-extension-utils/lib/webviewbridge");

page.webView.visible = false;
page.aiWait.visible = true;
const wvb = page.wvb = new WebViewBridge({
    webView: page.webView,
    source: "assets://amcharts_index.html"
});

wvb.loadScripts("amcharts/amcharts/amcharts.js", "amcharts/amcharts/serial.js")
    .then((loadedScriptNames) => {
        wvb.evaluateJS(chartScript, () => {
            page.webView.visible = true;
            page.aiWait.visible = false;
        });
    });

const chartScript = `
AmCharts.makeChart("chartdiv", {
     "type": "serial",
     "categoryField": "category",
     "startDuration": 1,
     "categoryAxis": {
         "gridPosition": "start"
     },
     "trendLines": [],
     "graphs": [{
             "balloonText": "[[title]] of [[category]]:[[value]]",
             "bullet": "round",
             "id": "AmGraph-1",
             "title": "graph 1",
             "valueField": "column-1"
         },
         {
             "balloonText": "[[title]] of [[category]]:[[value]]",
             "bullet": "square",
             "id": "AmGraph-2",
             "title": "graph 2",
             "valueField": "column-2"
         }
     ],
     "guides": [],
     "valueAxes": [{
         "id": "ValueAxis-1",
         "title": "Axis title"
     }],
     "allLabels": [],
     "balloon": {},
     "legend": {
         "enabled": true,
         "useGraphSettings": true
     },
     "titles": [{
         "id": "Title-1",
         "size": 15,
         "text": "Chart Title"
     }],
     "dataProvider": [{
             "category": "category 1",
             "column-1": 8,
             "column-2": 5
         },
         {
             "category": "category 2",
             "column-1": 6,
             "column-2": 7
         },
         {
             "category": "category 3",
             "column-1": 2,
             "column-2": 3
         },
         {
             "category": "category 4",
             "column-1": 1,
             "column-2": 3
         },
         {
             "category": "category 5",
             "column-1": 2,
             "column-2": 1
         },
         {
             "category": "category 6",
             "column-1": 3,
             "column-2": 2
         },
         {
             "category": "category 7",
             "column-1": 6,
             "column-2": 8
         }
     ]
 });
`
```
**Example**  
```js
//bi-directional communication
const WebViewBridge = require("sf-extension-utils/lib/webviewbridge");

const wvb = page.wvb = new WebViewBridge({
    webView: page.webView,
    source: "assets://index.html"
});

wvb.once("myEventName", function() { console.log("myEventName fired from WebView"); });

wvb.evaluateJS(`setTimeout(function() { window.boubleEvent("myEventName");})');

wvb.on("messageRecieved", (function(data) {
     console.log(`
        Message on webview is from: $ { data.from } and saying: $ { data.value }
        `);
 };
 
 wvb.evaluateJS(`
        // Create WebSocket connection.
        const socket = new WebSocket('ws://example.com:8080');

        // Connection opened
        socket.addEventListener('open', function(event) {
            var message = 'Hello Server!';
            socket.send(message);
            window.boubleEvent("messageRecieved", {
                from: "client",
                value: message
            });
        });

        // Listen for messages
        socket.addEventListener('message', function(event) {
            console.log('Message from server ', event.data);
            window.boubleEvent("messageRecieved", {
                from: "server",
                value: event.data
            });
        });

        `);
 
```
<a name="module_WebViewBridge..webView"></a>

### WebViewBridge~webView
WebView Instace which has been bridged

**Kind**: inner property of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Access**: public  
**Read only**: true  
**Properties**

| Type |
| --- |
| <code>UI.WebView</code> | 

<a name="module_WebViewBridge..loadedScriptNames"></a>

### WebViewBridge~loadedScriptNames
list of loaded script names

**Kind**: inner property of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Access**: public  
**Read only**: true  
**Properties**

| Type |
| --- |
| <code>Array.&lt;string&gt;</code> | 

<a name="module_WebViewBridge..source"></a>

### WebViewBridge~source
The source value which has been set

**Kind**: inner property of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Access**: public  
**Read only**: true  
**Properties**

| Type |
| --- |
| <code>string</code> \| <code>IO.File</code> | 

<a name="module_WebViewBridge..parseResponses"></a>

### WebViewBridge~parseResponses
Gets or Sets WebView.evalueJS to parse the responses. False value makes the execution faster, but the responses will not parsed, instead constant null value will be response of the execution. When true, executed code will be wrapped inside an immediate function

**Kind**: inner property of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Default**: <code>false</code>  
**Access**: public  
**Properties**

| Type |
| --- |
| <code>boolean</code> | 

<a name="module_WebViewBridge..delay"></a>

### WebViewBridge~delay
Gets or sets the delay (ms) between page being ready and code injection

**Kind**: inner property of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Default**: <code>0</code>  
**Access**: public  
**Properties**

| Type |
| --- |
| <code>number</code> | 

<a name="module_WebViewBridge..lastURL"></a>

### WebViewBridge~lastURL
Gets the last url shown in WebView

**Kind**: inner property of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Default**: <code>&quot;&quot;</code>  
**Access**: public  
**Read only**: true  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="module_WebViewBridge..ready"></a>

### WebViewBridge~ready() ⇒ <code>Promise</code>
Promise for WebView is ready for execution

**Kind**: inner method of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Returns**: <code>Promise</code> - - for checking readyness of the web page  
**Access**: public  
**Read only**: true  
<a name="module_WebViewBridge..loadScripts"></a>

### WebViewBridge~loadScripts() ⇒ <code>Promise</code>
Loads script files into WebView. Files loaded relative to the source. This call waits the ready call and executed after.

**Kind**: inner method of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Returns**: <code>Promise</code> - - Execution status of the Scripts can be checked by the first argument of the promise  
**Access**: public  
**Read only**: true  

| Type | Description |
| --- | --- |
| <code>string</code> \| <code>Array.&lt;string&gt;</code> | List of script names. |

**Example**  
```js
//Assume script1.js is to be failed, script2.js to be succeed
wvb.loadScripts("script1.js", "script2.js").then((loadedScripts) => {
    console.log("is script1 loaded? " + loadedScripts["script1.js"]); //false
    console.log("is script2 loaded? " + loadedScripts["script2.js"]); //true
});
```
<a name="module_WebViewBridge..refresh"></a>

### WebViewBridge~refresh()
Inserts WebViewBridge code inside WebPage

**Kind**: inner method of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Access**: public  
**Read only**: true  
<a name="module_WebViewBridge..evaluateJS"></a>

### WebViewBridge~evaluateJS()
Calls a specific version of evaluateJS for faster execution if parseResponses is false

**Kind**: inner method of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Access**: public  
**Read only**: true  
<a name="module_WebViewBridge..customNavigate"></a>

### WebViewBridge~customNavigate(options)
customNavigate is similar to webview.loadURL, with the options of setting cookie and custom user agent

**Kind**: inner method of [<code>WebViewBridge</code>](#module_WebViewBridge)  
**Access**: public  
**Read only**: true  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | is used to pass all options in single parameter |
| options.url | <code>string</code> | Remote url to open |
| [options.cookie] | <code>string</code> | Full browser cookie to set |
| [options.userAgent] | <code>string</code> | Custom user agent to set |

**Example**  
```js
wvb.customNavigate({
  url: "http://example.com",
  userAgent: "smartface",
  cookie: "yummy_cookie=choco; tasty_cookie=strawberry;"
});
```
