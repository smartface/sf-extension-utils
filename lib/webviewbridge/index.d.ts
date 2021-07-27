/**
 * Smartface WebView Bridge for bidirectional communication
 * @module WebViewBridge
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

import WebView = require('@smartface/native/ui/webview');
import File = require('@smartface/native/io/file');
import EventEmitter = require('wolfy87-eventemitter');

interface IBridgeConstructorOptions {
    /**
     * If not provided, it creates a new empty WebView instance. onChangedURL and onShow events of the WebView are set. Those event can be captured via .on("show", fn...) .on("changedURL", fn...)
     */
    webView?: WebView;
    /**
     *  URI scheme in webView to communicate with webview
     */
    scheme?: string;
    /**
     * source to inject bridge code
     */
    source?: string;
    /**
     *  when false, the WebView.evaluateJS runs faster without parsing the executed JS code response
     * @default false
     */
    parseResponses?: boolean;
    /**
     * when false bounce effect of the WebView is disabled
     * @default false
     */
    bounceEnabled?: boolean;
    /**
     * skips onLoad auto-bouble events. Might be useful to set true when there are redirections on page
     * @default false
     */
    skipLoadEvents?: boolean;
    /**
     * skips injection of boubleEvent on each page. Might be useful when there are redirections on page
     * @default false
     */
    skipBoubleEvent?: boolean;

    /**
     * sets delay between injection of boubleEvent and page show
     */
    delay?: number;
}

/**
 * WebViewBridge is used for bi-directional communication with WebView. Events from WebView are captured with {@link https://www.npmjs.com/package/wolfy87-eventemitter|EventEmiter}<br />
 * This bridge creates window.**boubleEvent** function inside WebPage of the WebView<br />
 * boubleEvent - Has two arguments: **eventName** (required), **data** (optional)<br />
 * Data is JSON.stringify'ied transfered to Smartface over URI with the designated URI scheme (msg is default). data of the event is object parsed form of the stringified data from WebView<br />
 * It is possible to load additional scripts with **loadScripts** method of the WebViewBridge<br />
 * Use WebViewBridge.**on** or WebViewBridge.**once** methods to capture the calls of window.boubleEvent calls from WebPage with given eventName<br />
 * Following eventNames are reserved for WebViewBridge internal usage: "addScript", "scriptLoaded", "window.onload"
 * The inserted code is also setting the window.onload event of the WebPage
 * 
 * For using the EventEmitter pattern, the default events of the WebView are given without the "on" prefix, starting with lowercase. Such as onChangedURL becomes "changedURL".
 * For the onChangedURL event on Smartface can have a return value that specifies to continue with navigation or not. This is achieved with setting the "continue" property of the eventArgument.
 * @public
 * @class
 * @augments EventEmitter
 * @example
 * //Bridge Creation with AM-Charts
 * import WebViewBridge from '@smartface/extension-utils/lib/webviewbridge'
 * 
 * this.webView.visible = false;
 * this.aiWait.visible = true;
 * const wvb = this.wvb = new WebViewBridge({
 *     webView: this.webView,
 *     source: "assets://amcharts_index.html"
 * });
 * 
 * wvb.loadScripts("amcharts/amcharts/amcharts.js", "amcharts/amcharts/serial.js")
 *     .then((loadedScriptNames) => {
 *         wvb.evaluateJS(chartScript, () => {
 *             this.webView.visible = true;
 *             this.aiWait.visible = false;
 *         });
 *     });
 * 
 * const chartScript = `
 * AmCharts.makeChart("chartdiv", {
 *      "type": "serial",
 *      "categoryField": "category",
 *      "startDuration": 1,
 *      "categoryAxis": {
 *          "gridPosition": "start"
 *      },
 *      "trendLines": [],
 *      "graphs": [{
 *              "balloonText": "[[title]] of [[category]]:[[value]]",
 *              "bullet": "round",
 *              "id": "AmGraph-1",
 *              "title": "graph 1",
 *              "valueField": "column-1"
 *          },
 *          {
 *              "balloonText": "[[title]] of [[category]]:[[value]]",
 *              "bullet": "square",
 *              "id": "AmGraph-2",
 *              "title": "graph 2",
 *              "valueField": "column-2"
 *          }
 *      ],
 *      "guides": [],
 *      "valueAxes": [{
 *          "id": "ValueAxis-1",
 *          "title": "Axis title"
 *      }],
 *      "allLabels": [],
 *      "balloon": {},
 *      "legend": {
 *          "enabled": true,
 *          "useGraphSettings": true
 *      },
 *      "titles": [{
 *          "id": "Title-1",
 *          "size": 15,
 *          "text": "Chart Title"
 *      }],
 *      "dataProvider": [{
 *              "category": "category 1",
 *              "column-1": 8,
 *              "column-2": 5
 *          },
 *          {
 *              "category": "category 2",
 *              "column-1": 6,
 *              "column-2": 7
 *          },
 *          {
 *              "category": "category 3",
 *              "column-1": 2,
 *              "column-2": 3
 *          },
 *          {
 *              "category": "category 4",
 *              "column-1": 1,
 *              "column-2": 3
 *          },
 *          {
 *              "category": "category 5",
 *              "column-1": 2,
 *              "column-2": 1
 *          },
 *          {
 *              "category": "category 6",
 *              "column-1": 3,
 *              "column-2": 2
 *          },
 *          {
 *              "category": "category 7",
 *              "column-1": 6,
 *              "column-2": 8
 *          }
 *      ]
 *  });
 * `
 * @example
 * //bi-directional communication
 * import WebViewBridge from '@smartface/extension-utils/lib/webviewbridge';
 * 
 * const wvb = this.wvb = new WebViewBridge({
 *     webView: this.webView,
 *     source: "assets://index.html"
 * });
 * 
 * wvb.once("myEventName", function() { console.log("myEventName fired from WebView"); });
 * 
 * wvb.evaluateJS(`setTimeout(function() { window.boubleEvent("myEventName");})');
 * 
 * wvb.on("messageRecieved", (function(data) {
 *      console.log(`
 *         Message on webview is from: $ { data.from } and saying: $ { data.value }
 *         `);
 *  };
 *  
 *  wvb.evaluateJS(`
 *         // Create WebSocket connection.
 *         const socket = new WebSocket('ws://example.com:8080');
 * 
 *         // Connection opened
 *         socket.addEventListener('open', function(event) {
 *             var message = 'Hello Server!';
 *             socket.send(message);
 *             window.boubleEvent("messageRecieved", {
 *                 from: "client",
 *                 value: message
 *             });
 *         });
 * 
 *         // Listen for messages
 *         socket.addEventListener('message', function(event) {
 *             console.log('Message from server ', event.data);
 *             window.boubleEvent("messageRecieved", {
 *                 from: "server",
 *                 value: event.data
 *             });
 *         });
 * 
 *         `);
 *  
 */

export default class WebViewBridge extends EventEmitter {
    /**
     * WebView Instace which has been bridged
     * @property {UI.WebView}
     * @readonly
     * @public
     */
    webView: WebView;
    /**
     * list of loaded script names
     * @property {string[]}
     * @readonly
     * @public
     */
    loadedScriptNames: string[];
    /**
     * Promise for WebView is ready for execution
     * @method
     * @readonly
     * @public
     * @returns {Promise} - for checking readyness of the web page
     */
    readonly ready: () => Promise<any>;
    /**
     * The source value which has been set
     * @property {string|IO.File}
     * @readonly
     * @public
     */
    readonly source: File;
    /**
     * Gets or Sets WebView.evalueJS to parse the responses. False value makes the execution faster, but the responses will not parsed, instead constant null value will be response of the execution. When true, executed code will be wrapped inside an immediate function
     * @property {boolean}
     * @public
     * @default false
     */
    parseResponses: boolean;
    /**
     * Gets or sets the delay (ms) between page being ready and code injection
     * @property {number}
     * @public
     * @default 0
     */
    delay: number;
    skipBoubleEvent: boolean;
    /**
     * Gets the last url shown in WebView
     * @property {string}
     * @public
     * @default ""
     * @readonly
     */
    readonly lastUrl: string;
    constructor(options: IBridgeConstructorOptions);

    /**
     * Loads script files into WebView. Files loaded relative to the source. This call waits the ready call and executed after.
     * @method
     * @public
     * @readonly
     * @param {string|string[]} - List of script names.
     * @returns {Promise} - Execution status of the Scripts can be checked by the first argument of the promise
     * @example
     * //Assume script1.js is to be failed, script2.js to be succeed
     * wvb.loadScripts("script1.js", "script2.js").then((loadedScripts) => {
     *     console.log("is script1 loaded? " + loadedScripts["script1.js"]); //false
     *     console.log("is script2 loaded? " + loadedScripts["script2.js"]); //true
     * });
     */
    readonly loadScripts(names: string | string[]): Promise<any>;
    /**
     * Inserts WebViewBridge code inside WebPage
     * @method
     * @public
     * @readonly
     */
    refresh(): void;
    /**
     * Calls a specific version of evaluateJS for faster execution if parseResponses is false
     * @method
     * @public
     * @param javascript Your javascript code to execute. Will be wrapped in a function
     * @readonly
     */
    evaluateJS: (javascript: string, onReceive?: (result: any) => any) => any;
    /**
     * customNavigate is similar to webview.loadURL, with the options of setting cookie and custom user agent
     * @method
     * @public
     * @readonly
     * @param {object} options - is used to pass all options in single parameter
     * @param {string} options.url - Remote url to open
     * @param {string} [options.cookie] - Full browser cookie to set
     * @param {string} [options.userAgent] - Custom user agent to set
     * @example
     * wvb.customNavigate({
     *   url: "http://example.com",
     *   userAgent: "smartface",
     *   cookie: "yummy_cookie=choco; tasty_cookie=strawberry;"
     * });
     */
    customNavigate: (options: {url: string, cookie: string, userAgent: string }) => void;
}