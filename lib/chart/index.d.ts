import WebViewBridge from '../webviewbridge'
import { ApexOptions } from 'apexcharts';

declare class ChartOptions {
    webViewBridge?: WebViewBridge;
    apexOptions?: ApexOptions;
}

export default class Chart extends ChartOptions {
    constructor(options?: ChartOptions);
    render(): void;
}
