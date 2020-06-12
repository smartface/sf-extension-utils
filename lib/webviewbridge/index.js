/*globals SF, requireClass */

/**
 * Smartface WebView Bridge for bidirectional communication
 * @module WebViewBridge
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

require("./base"); //make sure setTimeout is correct
const WebView = require('sf-core/ui/webview');
const EventEmitter = require('wolfy87-eventemitter');
const extend = require("js-base/core/extend");
const File = require('sf-core/io/file');
// const expect = require('chai').expect;
const System = require('sf-core/device/system');

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
 * @param {object} options - base options object
 * @param {UI.WebView} [options.webView = new WebView()] - If not provided, it creates a new empty WebView instance. onChangedURL and onShow events of the WebView are set. Those event can be captured via .on("show", fn...) .on("changedURL", fn...)
 * @param {string} [options.scheme = msg] - URI scheme in webView to communicate with webview
 * @param {string|IO.File} [options.source] - source to inject bridge code
 * @param {boolean} [options.parseResponses = false] - when false, the WebView.evaluateJS runs faster without parsing the executed JS code response
 * @param {boolean} [options.bounceEnabled = false] - when false bounce effect of the WebView is disabled
 * @param {boolean} [options.skipLoadEvents = false] - skips onLoad auto-bouble events. Might be useful to set true when there are redirections on page
 * @param {boolean} [options.skipBoubleEvent = false] - skips injection of boubleEvent on each page. Might be useful when there are redirections on page
 * @param {number} [options.delay = 0] - sets delay between injection of boubleEvent and page show
 * @example
 * //Bridge Creation with AM-Charts
 * const WebViewBridge = require("sf-extension-utils/lib/webviewbridge");
 * 
 * page.webView.visible = false;
 * page.aiWait.visible = true;
 * const wvb = page.wvb = new WebViewBridge({
 *     webView: page.webView,
 *     source: "assets://amcharts_index.html"
 * });
 * 
 * wvb.loadScripts("amcharts/amcharts/amcharts.js", "amcharts/amcharts/serial.js")
 *     .then((loadedScriptNames) => {
 *         wvb.evaluateJS(chartScript, () => {
 *             page.webView.visible = true;
 *             page.aiWait.visible = false;
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
 * const WebViewBridge = require("sf-extension-utils/lib/webviewbridge");
 * 
 * const wvb = page.wvb = new WebViewBridge({
 *     webView: page.webView,
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
const WebViewBridge = new extend(EventEmitter)(function (_super, options) {
    _super(this);
    const me = this;
    // expect(options).to.be.an("object");
    // options.source && expect(options).to.have.property('source').that.satisfy((source) => {
    //     return typeof source === "string" || source instanceof File;
    // }, "options.source should be a string or instnace of IO.File");

    const webView = options.webView || new WebView();
    const loadedScriptNames = [];
    var ready = false;
    const source = options.source;
    const scheme = options.scheme || "msg";
    const readyWaiting = [];
    var delay = options.delay || 0;
    var lastURL = "";
    var parseResponses = !!options.parseResponses;
    webView.bounceEnabled = !!options.bounceEnabled;
    var skipLoadEvents = options.skipLoadEvents || false;
    var skipBoubleEvent = options.skipBoubleEvent || false;


    Object.defineProperties(me, {
        /**
         * WebView Instace which has been bridged
         * @property {UI.WebView}
         * @readonly
         * @public
         */
        webView: {
            enumerable: true,
            configurable: false,
            value: webView,
            writable: false
        },
        /**
         * list of loaded script names
         * @property {string[]}
         * @readonly
         * @public
         */
        loadedScriptNames: {
            enumerable: true,
            configurable: false,
            value: loadedScriptNames,
            writable: false
        },
        /**
         * Promise for WebView is ready for execution
         * @method
         * @readonly
         * @public
         * @returns {Promise} - for checking readyness of the web page
         */
        ready: {
            enumerable: true,
            writable: false,
            value: readyFunction
        },
        /**
         * The source value which has been set
         * @property {string|IO.File}
         * @readonly
         * @public
         */
        source: {
            enumerable: true,
            writable: false,
            value: source
        },
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
        loadScripts: {
            enumerable: true,
            writable: false,
            value: loadScripts
        },
        /**
         * Inserts WebViewBridge code inside WebPage
         * @method
         * @public
         * @readonly
         */
        refresh: {
            enumerable: true,
            writable: false,
            value: refresh
        },
        /**
         * Gets or Sets WebView.evalueJS to parse the responses. False value makes the execution faster, but the responses will not parsed, instead constant null value will be response of the execution. When true, executed code will be wrapped inside an immediate function
         * @property {boolean}
         * @public
         * @default false
         */
        parseResponses: {
            enumerable: true,
            get: () => parseResponses,
            set: (value) => parseResponses = value
        },
        /**
         * Calls a specific version of evaluateJS for faster execution if parseResponses is false
         * @method
         * @public
         * @readonly
         */
        evaluateJS: {
            enumerable: true,
            writable: false,
            value: evaluateJS.bind(this)
        },
        /**
         * Gets or sets the delay (ms) between page being ready and code injection
         * @property {number}
         * @public
         * @default 0
         */
        delay: {
            enumerable: true,
            get: () => { return delay; },
            set: (value) => { return delay = value; }
        },
        skipBoubleEvent: {
            set: val => skipBoubleEvent = !!val
        },
        /**
         * Gets the last url shown in WebView
         * @property {string}
         * @public
         * @default ""
         * @readonly
         */
        lastURL: {
            enumerable: true,
            get: () => { return lastURL; }
        },

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
        customNavigate: {
            enumerable: true,
            writable: false,
            value: customNavigate.bind(this)
        }
    });

    webView.onChangedURL = function (event) {
        if (event.url.startsWith(scheme + '://')) {
            var eventObject = { event: null };
            try {
                eventObject = JSON.parse(decodeURIComponent(event.url.replace(scheme + '://', '')));
            }
            catch (ex) { }
            if (eventObject.event) {
                // console.log(`Event captured: ${eventObject.event} - ${JSON.stringify(eventObject.data)}`);
                me.emit(eventObject.event, eventObject.data);
            }
            return false;
        }
        else {
            let eventArgs = Object.assign({ continue: true }, event);
            me.emit("changedURL", eventArgs);
            if (!eventArgs.continue)
                return false;
            return true;
        }
    };

    webView.onShow = function (event) {
        var code = Math.random();
        me.once("window.onload", (params) => {
            if (code === params.code) {
                ready = true;
                readyWaiting.forEach(item => {
                    item();
                });
                readyWaiting.length = 0;
            }
        });
        lastURL = event.url;
        setTimeout(function (url) {
            if (lastURL !== url)
                return;
            me.emit("beforeShow", event);
            !skipBoubleEvent && insertScript.call(me, me.scheme, code, !!skipLoadEvents);
            me.emit("show", event);
        }.bind(global, lastURL), delay);
    };

    function readyFunction() {
        return new Promise((resolve, reject) => {
            if (ready)
                resolve();
            else
                readyWaiting.push(() => {
                    resolve();
                });
        });
    }



    // after constructing
    this.refresh();

});

function parseCookie(cookie) {
    return cookie.split(";").map(comp => `document.cookie= '${comp}';`).join(";");
}

function customNavigate(options) {
    const webView = this.webView;
    const cookie = options.cookie && ("" + options.cookie);
    const userAgent = options.userAgent;
    const targetUrl = options.url;
    /*
    if (!userAgent) {
        alert(` userAgent: ${userAgent} link: ${targetUrl} cookie: ${cookie}`)
    }
    */

    if (System.OS === "iOS") {
        if (cookie) {
            webView.nativeObject.onStartDocumentHandler = () => {
                this.evaluateJS(parseCookie(cookie));
            };
        }
        var MutableRequest = SF.requireClass("NSMutableURLRequest");

        var request = MutableRequest.requestWithURL(__SF_NSURL.URLWithString(targetUrl));
        cookie && request.addValueForHTTPHeaderField(`${cookie}`, "Cookie");
        userAgent && (webView.userAgent = userAgent);
        webView.nativeObject.load(request); //this is equvalent of webview.loadURL
    }
    else {
        if (cookie) {
            const CookieManager = requireClass("android.webkit.CookieManager");
            var cookieManager = CookieManager.getInstance();
            cookieManager.setAcceptCookie(true);
            let cookies = cookie.split(";");
            cookies.forEach((c, index) => {
                cookies[index] = c.trim();
                c && cookieManager.setCookie(targetUrl, c);
            });
        }
        userAgent && (webView.userAgent = userAgent);
        webView.loadURL(targetUrl);
    }
}

function evaluateJS(javascript, onReceive) {
    if (!this.parseResponses)
        javascript = `(function(){\n${javascript}\n})();null;`;
    if (onReceive) {
        let originalReceiveFunction = onReceive;
        onReceive = result => {
            if (System.OS === "Android" && result && this.parseResponses) {
                try {
                    result = JSON.parse(result);
                }
                catch (ex) { }
            }
            originalReceiveFunction(result);
        };
    }
    return this.webView.evaluateJS(javascript, onReceive);
}


function refresh() {
    const me = this;
    if (!me.source)
        return;
    var isFile = false;
    if (typeof me.source === "string") {
        if (!me.source.toLowerCase().startsWith("http"))
            isFile = true;
    }
    else
        isFile = true;
    if (isFile)
        me.webView.loadFile(typeof me.source === "string" ?
            new File({ path: me.source }) : me.source);
    else
        me.webView.loadURL(me.source);
}

function insertScript(scheme, code) {
    scheme = scheme || "msg";
    code = code || 0;
    const me = this;
    const script = `(function (scheme, code, skipLoadEvents) {
    if(window.boubleEvent && !skipLoadEvents) {
        window.boubleEvent("bridge.duplicateLoad", {code: code});
        return;
    }

    window.boubleEvent = function boubleEvent(event, data) {
        var eventObject = {
            event: event,
            data: data || null
        };
        var eventString = encodeURIComponent(JSON.stringify(eventObject));
        window.location = scheme + "://" + eventString;
    };

    window.addScript = function addScript(fileNames) {
        if (typeof fileNames === "string") {
            try {
                fileNames = JSON.parse(fileNames);
            }
            catch (fineNamesEx) {
                fileNames = [fileNames];
            }
        }
        else {
            fileNames = [];
        }
        var scriptLoadStatus = {};
        window.boubleEvent("addScript", { fileNames: fileNames });
        var headElement = document.getElementsByTagName('head')[0];

        loadScript();

        function loadScript() {
            var scriptName = fileNames.shift();
            if (scriptName) {
                if (scriptName.endsWith(".js"))
                    scriptName.substr(0, scriptName.length - 3);
                var script = document.createElement('script');
                script.onload = function() {
                    scriptLoadStatus[scriptName] = true;
                    loadScript();
                };
                script.onerror = function(e) {
                    scriptLoadStatus[scriptName] = false;
                    loadScript();
                };
                script.src = scriptName;
                script.type = 'text/javascript';
                headElement.appendChild(script);
            }
            else {
                window.boubleEvent("scriptLoaded", scriptLoadStatus);
            }
        }
    };

    function checkLoaded() {
        return document.readyState === "complete" || document.readyState === "interactive";
    }
    
    if (!checkLoaded()) {
        window.onload = function() {
            !skipLoadEvents && window.boubleEvent("window.onload", { code: code });
        };
    } else
        !skipLoadEvents && window.boubleEvent("window.onload", { code: code });
})("${scheme}", ${code})`;

    me.evaluateJS(script);

}

function loadScripts() {
    const me = this;
    var scriptNames = [];
    if (arguments.length === 1) {
        if (arguments[0] instanceof Array) {
            scriptNames = arguments[0];
        }
        else {
            scriptNames.push(arguments[0]);
        }
    }
    else {
        scriptNames = Array.prototype.slice.call(arguments);
    }

    scriptNames = scriptNames.filter((item) => { return me.loadedScriptNames.indexOf(item) === -1; });
    return new Promise((resolve, reject) => {
        if (scriptNames.length === 0) {
            reject();
            return;
        }
        me.ready().then(() => {
            var myScript = "window.addScript('" + JSON.stringify(scriptNames) + "');";
            me.once("scriptLoaded", (scriptLoadStatus) => {
                for (let s in scriptLoadStatus) {
                    scriptLoadStatus[s] && me.loadedScriptNames.push(s);
                }
                resolve(scriptLoadStatus);
            });
            me.evaluateJS(myScript);
        });
    });

}

module.exports = exports = WebViewBridge;
