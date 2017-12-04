/**
 * Smartface Fingerprint for login module
 * @module fingerprint
 * @type {object}
 * @author Alper Ozisik <alper.ozisik@smartface.io>
 * @copyright Smartface 2017
 */

const WebView = require('sf-core/ui/webview');
const EventEmitter = require('wolfy87-eventemitter');
const extend = require("js-base/core/extend");
const File = require('sf-core/io/file');
const expect = require('chai').expect;

/**
 * WebViewBridge
 * @param {object} [options]
 * @param {UI.WebView} [options.webView = new WebView()]
 * @params {string} options.scheme URI scheme to communicate with webview
 */
const WebViewBridge = new extend(EventEmitter)(function(_super, options) {
    _super(this);
    const me = this;
    expect(options).to.be.an("object");
    expect(options).to.have.property('source').that.is.a('string');

    const webView = options.webView || new WebView();
    const loadedScriptNames = [];
    var ready = false;
    const source = options.source; //TODO: Enfornce
    const scheme = options.scheme || "msg";
    const readyWaiting = [];

    Object.defineProperties(me, {
        webView: {
            enumerable: true,
            configurable: false,
            value: webView,
            writable: false
        },
        loadedScriptNames: {
            enumerable: true,
            configurable: false,
            value: loadedScriptNames,
            writable: false
        },
        ready: {
            enumerable: true,
            writable: false,
            value: readyFunction
        },
        source: {
            enumerable: true,
            writable: false,
            value: source
        },
        evaluateJS: {
            enumerable: true,
            writable: false,
            value: webView.evaluateJS.bind(webView)
        },
        loadScripts: {
            enumerable: true,
            writable: false,
            value: loadScripts
        },
        refresh: {
            enumerable: true,
            writable: false,
            value: refresh
        },
    });

    webView.onChangedURL = function(event) {
        if (event.url.startsWith(scheme + '://')) {
            var eventObject = { event: null };
            try {
                eventObject = JSON.parse(decodeURIComponent(event.url.replace(scheme + '://', '')));
            }
            catch (ex) {}
            if (eventObject.event) {
                // console.log(`Event captured: ${eventObject.event} - ${JSON.stringify(eventObject.data)}`);
                me.emit(eventObject.event, eventObject.data);
            }
            return false;
        }
        return true;
    };

    webView.onLoad = function(event) {
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
        insertScript.call(me, me.scheme, code);
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

    webView.bounceEnabled = false;

    // after constructing
    this.refresh();

});



function refresh() {
    const me = this;
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
    `(function (scheme, code) {
    if(window.boubleEvent) {
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

    window.onload = function() {
        window.boubleEvent("window.onload", {code: code});
    };
})("${scheme}", "${code}")`;

}

function loadScripts() {
    const me = this;
    var scriptNames = [].concat(
        arguments.length === 1 ?
        arguments[0] :
        arguments
    );
    scriptNames = scriptNames.filter((item) => { return me.loadedScriptNames.indexOf(item) === -1; });
    return new Promise((resolve, reject) => {
        if (scriptNames.length === 0) {
            reject();
            return;
        }
        var myScript = "window.addScript('" + JSON.stringify(scriptNames) + "');";
        me.once("scriptLoaded", (scriptLoadStatus) => {
            for (let s in scriptLoadStatus) {
                scriptLoadStatus[s] && me.loadedScriptNames.push(s);
            }
            resolve(scriptLoadStatus);
        });
        me.webView.evaluateJS(myScript);
    });

}
