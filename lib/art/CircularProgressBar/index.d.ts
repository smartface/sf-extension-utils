import WebView = require("@smartface/native/ui/webview");

declare class CircularProgressBarOptions { 
    /**
     * Should be an instance of @smartface/native/ui/webview
     * @see https://developer.smartface.io/docs/webview
     */
    webView: WebView;
    /**
     * @default 4
     * Width of the stroke
     */
    strokeWidth?: number;
    /**
     * @default "#555"
     * shorthand hexadecimal color declaration - #000
     */
    color?: string;
    /**
     * @default 2
     * Duration for animation in seconds
     */
    duration?: number;
    /**
     * @default "#eee"
     * Shorthand hexadecimal - #000
     * Color for lighter trail stroke underneath the actual progress path
     */
    trailColor?: string;
    /**
     * @default 4
     * Width of the trail stroke in pixels
     */
    trailWidth?: number;
    /**
     * @default 100
     * Size of the progress bar (both width & height)
     */
    width?: number;
}

/**
 * @class
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2020
 * @example
 * import CircularProgressBar from '@smartface/extension-utils/lib/art/CircularProgressBar';
 *
 * const circularProgressBar = new CircularProgressBar({
 *     width: 130,
 *     trailColor: "rgb(247,201,71)",
 *     color: "rgb(55,85,147)",
 *     webView: this.wvCircularAnimation 
 * });
 * 
 * // Triggers the render method whenever the value is set
 * circularProgressBar.value = 70;
 */
export default class CircularProgressBar extends CircularProgressBarOptions {
    /**
     * Gets/sets current shown progress from 0 to 100
     * Re-renders the progress bar when the value is set
     */
    value: number;
    constructor(options: CircularProgressBarOptions);
    private static __calculateCurrentDashoffset(currentValue: number): number;
    /**
     * Creates proper HTML and triggers loadHTML method of UI.WebView
     */
    private render(): void;
}