class Chart {
    constructor(options = {}) {
        this.webViewBridge = options.webViewBridge;
        this.apexOptions = options.apexOptions;

        if (!this.webViewBridge) {
            throw new Error("webViewBridge parameter is required");
        }
    }

    convertObjectToString(obj) {
        if (obj instanceof Array) return JSON.stringify(obj);
        if (typeof obj === 'string') return `'${obj}'`;
        if (typeof obj === 'function') return obj.toString();
        if (typeof obj === 'object') return `{${Object.keys(obj).map((prop) => `${prop}:${this.convertObjectToString(obj[prop])}`).join(',')}}`;
        return obj;
    }

    render() {
        const html = `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>

            <body>
                <div id="chart"></div>

                <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
                <script>
                    var options = ${this.convertObjectToString(this.apexOptions)};
                    var chart = new ApexCharts(document.querySelector("#chart"), options);
                    chart.render();
                </script>
            </body>

            </html>
        `;
        this.webViewBridge.webView.loadHTML(html);
    }
}

exports = module.exports = Chart;