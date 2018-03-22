const Http = require("sf-core/net/http");
const httpMap = new WeakMap();
const optionsMap = new WeakMap();
const mixinDeep = require('mixin-deep');
const copy = require("./copy");
const METHODS_WITHOUT_BODY = ["GET", "HEAD"];
const BASE_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Accept-Language": global.Device.language,
    "Cache-Control": "no-cache"
};
Object.freeze(BASE_HEADERS);
const queryString = require('query-string');


module.exports = exports = ServiceCall;

class ServiceCall {
    constructor(options) {
        options = copy(options);
        const http = new Http({
            timeout: options.timeout
        });
        httpMap.add(this, http);
        optionsMap.add(this, options);

    }
    setCommonHeaderValue(key, value) {
        if (typeof key === "object") {
            for (let k in key) {
                let v = key[k];
                this.setCommonHeaderValue(k, v);
            }
        }
        else if (typeof key === "string") {
            if (value) {
                commonHeaders[key] = String(value);
            }
            else
                delete commonHeaders[key];
        }
        else
            throw Error("key must be string or object");
    }
    createRequestOptions(endpointPath, options) {
        const serviceCallOptions = optionsMap.get(this);
        if (!serviceCallOptions)
            throw Error("This ServiceCall instnace is not configured");
        var url = String(serviceCallOptions.baseURL + endpointPath);
        if (url.substring(0, 4).toLowerCase() !== "http")
            throw Error(`URL is not valid: ${url}`);
        var requestOptions = mixinDeep({
            url,
            headers: serviceCallOptions.headers
        }, options || {});
        return requestOptions;
    }
    request(endpointPath, options) {
        const requestOptions = this.createRequestOptions(endpointPath, options);
        return ServiceCall.request(requestOptions);
    }

    static request(options) {
        const http = options.http || new Http();
        var query = options.q || options.query;
        options.url = String(options.url);
        if (query) {
            let urlParts = options.url.split("?");
            query = Object.assign(queryString.parse(urlParts[1]), query);
            urlParts[1] = queryString.stringify(query);
            options.url = urlParts.join("?");
        }
        return new Promise((resolve, reject) => {
            var requestOptions = mixinDeep({
                onLoad: function(response) {
                    try {
                        response.logEnabled = !!response.logEnabled;
                        bodyParser(response);
                        if (response.body.success === false)
                            reject(response.body);
                        else
                            resolve(response.body);
                    }
                    catch (ex) {
                        reject(ex);
                    }
                },
                onError: function(e) {
                    e.headers = e.headers || {};
                    e.body = e.body || "";
                    e.logEnabled = !!options.logEnabled;
                    bodyParser(e);
                    reject(e);
                }
            }, options);
            if (METHODS_WITHOUT_BODY.indexOf(requestOptions.method) !== -1) {
                if (requestOptions.body) {
                    delete requestOptions.body;
                }
                if (requestOptions.headers["Content-Type"])
                    delete requestOptions.headers["Content-Type"];
            }
            else {
                if (requestOptions.body && typeof requestOptions.body === "object" &&
                    requestOptions.headers["Content-Type"].startsWith("application/json")) {
                    requestOptions.body = JSON.stringify(requestOptions.body);
                }
            }

            options.logEnabled && console.log(`request: ${JSON.stringify(requestOptions, null, "\t")}`);
            http.request(requestOptions);
        });
    }
    static get BASE_HEADERS() { return BASE_HEADERS; }

}

function bodyParser(response) {
    const contentType = (response.headers && getContentType(response.headers)) || "";
    switch (true) {
        case !contentType.startsWith("image"):
            response.body = response.body.toString();

        case contentType === "application/json":
            try {
                response.body = JSON.parse(response.body);
                console.log(`Response body = ${JSON.stringify(response.body, null, "\t")}`);
            }
            catch (ex) {
                console.log(`Response is not a  JSON\nResponse Body = ${response.body}`);
            }
            break;
    }
}

function getContentType(headers = {}) {
    var contentType = headers["Content-Type"];
    if (!contentType) {
        for (let h in headers) {
            if (h.toLowerCase() === "content-type") {
                contentType = headers[h];
                break;
            }
        }
    }
    return contentType;
}
