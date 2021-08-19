/**
 * Smartface WebView Bridge for bidirectional communication
 * @module WebViewBridge
 * @type {function}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2018
 */

import WebView from "@smartface/native/ui/webview";
import File from "@smartface/native/io/file";
import EventEmitter from "wolfy87-eventemitter";
import System from "@smartface/native/device/system";

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
	source?: string | File;
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

export default class WebViewBridge extends EventEmitter
	implements IBridgeConstructorOptions {
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
	loadedScriptNames: string[] = [];
	/**
	 * Promise for WebView is ready for execution
	 * @method
	 * @readonly
	 * @public
	 * @returns {Promise} - for checking readyness of the web page
	 */
	readonly ready: () => Promise<void> = this.readyFunction;
	/**
	 * The source value which has been set
	 * @property {string|IO.File}
	 * @readonly
	 * @public
	 */
	readonly source: string | File;
	/**
	 * Gets or Sets WebView.evalueJS to parse the responses. False value makes the execution faster, but the responses will not parsed, instead constant null value will be response of the execution. When true, executed code will be wrapped inside an immediate function
	 * @property {boolean}
	 * @public
	 * @default false
	 */
	parseResponses = false;
	/**
	 * Gets or sets the delay (ms) between page being ready and code injection
	 * @property {number}
	 * @public
	 * @default 0
	 */
	delay = 0;
	skipBoubleEvent: boolean;
	/**
	 * Gets the last url shown in WebView
	 * @property {string}
	 * @public
	 * @default ""
	 */
	lastURL = "";
	scheme: string;
	private isReady = false;
	private readyWaiting: any[] = [];
	private skipLoadEvent = false;
	skipLoadEvents = false;
	constructor(options: IBridgeConstructorOptions) {
		super();
		this.webView = options.webView || new WebView();
		this.webView.ios.bounces = !!options.bounceEnabled;
		this.loadedScriptNames = [];
		this.source = options.source || "";
		this.scheme = options.scheme || "msg";
		const readyWaiting = [];
		var delay = options.delay || 0;
		this.parseResponses = !!options.parseResponses;
		this.skipLoadEvents = options.skipLoadEvents || false;
		this.skipBoubleEvent = options.skipBoubleEvent || false;
		this.initWebView();
	}

	private initWebView() {
		this.webView.onChangedURL = (event) => {
			if (event.url.startsWith(this.scheme + "://")) {
				let eventObject: { event: any; data?: any } = { event: null };
				try {
					eventObject = JSON.parse(
						decodeURIComponent(event.url.replace(this.scheme + "://", ""))
					);
				} catch (ex) {}
				if (eventObject.event) {
					// console.log(`Event captured: ${eventObject.event} - ${JSON.stringify(eventObject.data)}`);
					this.emit(eventObject.event, eventObject.data);
				}
				return false;
			} else {
				const eventArgs = Object.assign({ continue: true }, event);
				this.emit("changedURL", eventArgs);
				return !!eventArgs.continue;
			}
		};
		this.webView.onShow = (event) => {
			const code = Math.random();
			this.once("window.onload", (params: any) => {
				if (code === params.code) {
					this.isReady = true;
					this.readyWaiting.forEach((item) => {
						item();
					});
					this.readyWaiting.length = 0;
				}
			});
			this.lastURL = event.url;
			setTimeout((url = this.lastURL) => {
				if (this.lastURL !== url) {
					return;
				}
				this.emit("beforeShow", event);
				if (!this.skipBoubleEvent) {
					this.insertScript(this.scheme, code);
				}
				if (!this.skipBoubleEvent) {
					this.emit("show", event);
				}
				!this.skipBoubleEvent && this.emit("show", event);
			}, this.delay);
		};
	}

	readyFunction(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.isReady) {
				resolve();
			} else {
				this.readyWaiting.push(() => resolve());
			}
		});
	}

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
	loadScripts(names: string | string[]): Promise<any> {
		let scriptNames: any[] = [];
		if (arguments.length === 1) {
			if (arguments[0] instanceof Array) {
				scriptNames = arguments[0];
			} else {
				scriptNames.push(arguments[0]);
			}
		} else {
			scriptNames = Array.prototype.slice.call(arguments);
		}

		scriptNames = scriptNames.filter((item) => {
			return this.loadedScriptNames.indexOf(item) === -1;
		});
		return new Promise((resolve, reject) => {
			if (scriptNames.length === 0) {
				reject();
				return;
			}
			this.ready().then(() => {
				var myScript =
					"window.addScript('" + JSON.stringify(scriptNames) + "');";
				this.once("scriptLoaded", (scriptLoadStatus: any) => {
					for (let s in scriptLoadStatus) {
						scriptLoadStatus[s] && this.loadedScriptNames.push(s);
					}
					resolve(scriptLoadStatus);
				});
				this.evaluateJS(myScript);
			});
		});
	}
	/**
	 * Inserts WebViewBridge code inside WebPage
	 * @method
	 * @public
	 * @readonly
	 */
	refresh(): void {
		if (!this.source) {
			return;
		}
		let isFile = false;
		if (typeof this.source === "string") {
			if (!this.source.toLowerCase().startsWith("http")) {
				isFile = true;
			}
		} else {
			isFile = true;
		}
		if (isFile) {
			this.webView.loadFile(
				typeof this.source === "string"
					? new File({ path: this.source })
					: this.source
			);
		} else {
			if (this.source === "string") {
				this.webView.loadURL(this.source);
			}
		}
	}
	/**
	 * Calls a specific version of evaluateJS for faster execution if parseResponses is false
	 * @method
	 * @public
	 * @param javascript Your javascript code to execute. Will be wrapped in a function
	 * @readonly
	 */
	evaluateJS(javascript: string, onReceive?: (result: any) => any): any {
		if (!this.parseResponses)
			javascript = `(function(){\n${javascript}\n})();null;`;
		if (onReceive) {
			let originalReceiveFunction = onReceive;
			onReceive = (result) => {
				if (
					System.OS === System.OSType.ANDROID &&
					result &&
					this.parseResponses
				) {
					try {
						result = JSON.parse(result);
					} catch (ex) {}
				}
				originalReceiveFunction(result);
			};
		}
		return this.webView.evaluateJS(javascript, onReceive || (() => {}));
	}
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
	customNavigate(options: {
		url: string;
		cookie: string;
		userAgent: string;
	}): void {
		const webView = this.webView;
		const cookie = options.cookie && "" + options.cookie;
		const userAgent = options.userAgent;
		const targetUrl = options.url;
		/*
    if (!userAgent) {
        alert(` userAgent: ${userAgent} link: ${targetUrl} cookie: ${cookie}`)
    }
    */

		if (System.OS === System.OSType.IOS) {
			if (cookie) {
        //@ts-ignore
				webView.nativeObject.onStartDocumentHandler = () => {
					this.evaluateJS(this.parseCookie(cookie));
				};
			}
      //@ts-ignore
			const MutableRequest = requireClass("NSMutableURLRequest");

			var request = MutableRequest.requestWithURL(
        //@ts-ignore
				__SF_NSURL.URLWithString(targetUrl)
			);
			cookie && request.addValueForHTTPHeaderField(`${cookie}`, "Cookie");
			userAgent && (webView.userAgent = userAgent);
      //@ts-ignore
			webView.nativeObject.load(request); //this is equvalent of webview.loadURL
		} else {
			if (cookie) {
        //@ts-ignore
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
  private parseCookie(cookie: string) {
    return cookie.split(";").map(comp => `document.cookie= '${comp}';`).join(";");
  }
  private insertScript(scheme: any, code: number) {
    scheme = scheme || "msg";
    code = code || 0;
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
    this.evaluateJS(script);
  }
}