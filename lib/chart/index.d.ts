/**
 * @module Chart
 * @type {Object}
 * @author Berk Baski <berk.baski@smartface.io>
 * @copyright Smartface 2021
 */

import WebViewBridge from '../webviewbridge';
import { ApexOptions } from 'apexcharts';

/** It allows passing custom data into the chart */
declare type BarOptions = {
	[key: string]: any;
};

declare class ChartOptions {
	/** Browser to display ApexCharts charts and listen to events */
	webViewBridge?: WebViewBridge;

	/** Required options for render to chart. More info {@link https://github.com/apexcharts/apexcharts.js|ApexCharts.js} */
	apexOptions?: ApexOptions & { barOptions?: BarOptions };

	/** Optional css options for html */
	customCss?: string;
}

/**
 * It allows creating charts using the ApexCharts. It communicates between the events of the ApexCharts and the Smartface using WebViewBridge
 * @public
 * @class
 * @param {object} options - Base options object
 * @param {WebViewBridge} options.webViewBridge - Browser to display ApexCharts charts and listen to events
 * @param {ApexOptions} options.apexOptions - Required options for render to chart. More info {@link https://github.com/apexcharts/apexcharts.js|ApexCharts.js}
 * @param {string} options.customCss - Optional css options for html
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
export default class Chart extends ChartOptions {
	constructor(options?: ChartOptions);

	/**
	 * It converts chart options to string for render to WebView
	 * @method
	 * @param {object} obj - Chart options
	 * @public
	 */
	convertObjectToString(obj: any): string;

	/**
	 * It renders the given chart options to the WebViewBridge browser
	 * @method
	 * @public
	 */
	render(): void;
}
