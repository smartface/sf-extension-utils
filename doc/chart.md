<a name="module_Chart"></a>

## Chart : <code>Object</code>
**Author**: Berk Baski <berk.baski@smartface.io>  
**Copyright**: Smartface 2021  

* [Chart](#module_Chart) : <code>Object</code>
    * [~Chart](#module_Chart..Chart)
        * [new Chart(options)](#new_module_Chart..Chart_new)
        * [.convertObjectToString(obj)](#module_Chart..Chart+convertObjectToString)
        * [.render()](#module_Chart..Chart+render)

<a name="module_Chart..Chart"></a>

### Chart~Chart
It allows creating charts using the ApexCharts. It communicates between the events of the ApexCharts and the Smartface using WebViewBridge

**Kind**: inner class of [<code>Chart</code>](#module_Chart)  
**Access**: public  

* [~Chart](#module_Chart..Chart)
    * [new Chart(options)](#new_module_Chart..Chart_new)
    * [.convertObjectToString(obj)](#module_Chart..Chart+convertObjectToString)
    * [.render()](#module_Chart..Chart+render)

<a name="new_module_Chart..Chart_new"></a>

#### new Chart(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Base options object |
| options.webViewBridge | <code>WebViewBridge</code> | Browser to display ApexCharts charts and listen to events |
| options.apexOptions | <code>ApexOptions</code> | Required options for render to chart. More info [ApexCharts.js](https://github.com/apexcharts/apexcharts.js) |
| options.customCss | <code>string</code> | Optional css options html |

**Example**  
```js
const wvb = new WebViewBridge({
   webView: this.webView1
});

wvb.on('markerClick', function (event) {
    console.log('Clicked to a marker on Smartface');
});

const chart = new Chart({
    webViewBridge: wvb,
    apexOptions: {
        barOptions: {
            percent: 0.75
        },
        series: [{
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
            events: {
                markerClick: () => {
                    //@ts-ignore
                    window.boubleEvent("EVENT_CHART_EVENTS_markerClick");
                }
            }
        },
        dataLabels: {
            enabled: false,
            formatter: function (val, opt) {
                return val / opt?.w?.config?.percent;
            }
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Product Trends by Month',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
    }
});
chart.render();
```
<a name="module_Chart..Chart+convertObjectToString"></a>

#### chart.convertObjectToString(obj)
It converts chart options to string for render to WebView

**Kind**: instance method of [<code>Chart</code>](#module_Chart..Chart)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | Chart options |

<a name="module_Chart..Chart+render"></a>

#### chart.render()
It renders the given chart options to the WebViewBridge browser

**Kind**: instance method of [<code>Chart</code>](#module_Chart..Chart)  
**Access**: public  
