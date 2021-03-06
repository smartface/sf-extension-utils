/**
 * @module Chart
 * @type {Object}
 * @author Berk Baski <berk.baski@smartface.io>
 * @copyright Smartface 2021
 */

/**
 * It allows creating charts using the ApexCharts. It communicates between the events of the ApexCharts and the Smartface using WebViewBridge
 * @public
 * @class
 * @param {object} options - Base options object
 * @param {WebViewBridge} options.webViewBridge - Browser to display ApexCharts charts and listen to events
 * @param {ApexOptions} options.apexOptions - Required options for render to chart. More info {@link https://github.com/apexcharts/apexcharts.js|ApexCharts.js}
 * @param {string} options.customCss - Optional css options html
 * @example
 *const wvb = new WebViewBridge({
 *    webView: this.webView1
 *});
 * 
 * wvb.on('markerClick', function (event) {
 *     console.log('Clicked to a marker on Smartface');
 * });
 *
 * const chart = new Chart({
 *     webViewBridge: wvb,
 *     apexOptions: {
 *         barOptions: {
 *             percent: 0.75
 *         },
 *         series: [{
 *             name: "Desktops",
 *             data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
 *         }],
 *         chart: {
 *             height: 350,
 *             type: 'line',
 *             zoom: {
 *                 enabled: false
 *             },
 *             events: {
 *                 markerClick: () => {
 *                     //@ts-ignore
 *                     window.boubleEvent("EVENT_CHART_EVENTS_markerClick");
 *                 }
 *             }
 *         },
 *         dataLabels: {
 *             enabled: false,
 *             formatter: function (val, opt) {
 *                 return val / opt?.w?.config?.percent;
 *             }
 *         },
 *         stroke: {
 *             curve: 'straight'
 *         },
 *         title: {
 *             text: 'Product Trends by Month',
 *             align: 'left'
 *         },
 *         grid: {
 *             row: {
 *                 colors: ['#f3f3f3', 'transparent'],
 *                 opacity: 0.5
 *             },
 *         },
 *         xaxis: {
 *             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
 *         }
 *     }
 * });
 * chart.render();
 */
 class Chart {
    constructor(options = {}) {
        this.webViewBridge = options.webViewBridge;
        this.apexOptions = options.apexOptions;
        this.customCss = options.customCss;
        if (!this.webViewBridge) {
            throw new Error("webViewBridge parameter is required");
        }
    }

    /**
     * It converts chart options to string for render to WebView
     * @method
     * @param {object} obj - Chart options
     * @public
     */
    convertObjectToString(obj) {
        if (obj instanceof Array) return JSON.stringify(obj);
        if (typeof obj === 'string') return `'${obj}'`;
        if (typeof obj === 'function') return obj.toString();
        if (typeof obj === 'object') return `{${Object.keys(obj).map((prop) => `${prop}:${this.convertObjectToString(obj[prop])}`).join(',')}}`;
        return obj;
    }

    /**
     * It renders the given chart options to the WebViewBridge browser
     * @method
     * @public
     */
    render() {
        const styles = this.customCss ? `<style> ${this.customCss} </style>` : "";
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
                ${styles}
            </body>

            </html>
        `;
        this.webViewBridge.webView.loadHTML(html);
    }
}

exports = module.exports = Chart;