/**
 * @module CircularProgressBar
 * @type {Object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2020
 */

import WebView from "@smartface/native/ui/webview";

interface CircularProgressBarOptions {
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
 * ```
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
 * ```
 */
export default class CircularProgressBar {
  /**
   * Gets/sets current shown progress from 0 to 100
   * Re-renders the progress bar when the value is set
   */
  private __value = 0;
  private __strokeWidth = 4;
  private __color = "#555";
  private __duration = 2;
  private __trailColor = "#eee";
  private __trailWidth = 4;
  private __width = 100;
  private __webView: WebView;
  constructor(options: CircularProgressBarOptions) {
    if (!options.webView) {
      throw Error("webView parameter is required");
    }
    this.__strokeWidth = options.strokeWidth || this.__strokeWidth;
    this.__duration = options.duration || this.__duration;
    this.__color = options.color || this.__color;
    this.__trailColor = options.trailColor || this.__trailColor;
    this.__trailWidth = options.trailWidth || this.__trailWidth;
    this.__width = options.width || this.__width;
    this.__webView = options.webView;
  }
  private static __calculateCurrentDashoffset(currentValue: number): number {
    const RADIUS = 54;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    return CIRCUMFERENCE * (1 - currentValue / 100);
  }

  /**
   * Current shown progress from 0 to 100. This can be get and set.
   * @property {number} value
   */
  public get value(): number {
    return this.value;
  }

  /**
   * Current shown progress from 0 to 100. This can be get and set.
   * @property {number} value
   */
  public set value(value: number) {
    this.value = value;
    this.render();
  }
  /**
   * Creates proper HTML and triggers loadHTML method of UI.WebView
   */
  private render(): void {
    let htmlTemplate = `
    <html>
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <head>
    <style>
        .progress {
        transform: rotate(-90deg);
        }

        .progress__value {
        stroke-dasharray: 339.292;
        stroke-dashoffset: 339.292;
        animation: progress {__DURATION__}s;
        stroke-linecap: round;
        }

        @keyframes progress {
        from {
            stroke-dashoffset: 339.292;
        }

        to {
            stroke-dashoffset: {__DASHOFFSET__};
        }
        }
    </style>
    </head>

    <body style="margin: 0px; padding: 0px;">
    <div class="demo">
        <svg class="progress" width="{__WIDTH__}" height="{__WIDTH__}" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="{__COLOR__}" stroke-width="{__STROKE_WIDTH__}" />
        <circle class="progress__value" cx="60" cy="60" r="54" fill="none" stroke="{__TRAIL_COLOR__}" stroke-width="{__TRAIL_WIDTH__}"
            style="stroke-dashoffset: {__DASHOFFSET__};"></circle>
        </svg>
    </div>
    </body>
    </html>
    `;

    htmlTemplate = htmlTemplate.replace(
      /{__DASHOFFSET__}/g,
      String(CircularProgressBar.__calculateCurrentDashoffset(this.__value))
    );
    htmlTemplate = htmlTemplate.replace(/{__DURATION__}/g, String(this.__duration));
    htmlTemplate = htmlTemplate.replace(/{__WIDTH__}/g, String(this.__width));
    htmlTemplate = htmlTemplate.replace(
      /{__TRAIL_WIDTH__}/g,
      String(this.__trailWidth)
    );
    htmlTemplate = htmlTemplate.replace(
      /{__TRAIL_COLOR__}/g,
      this.__trailColor
    );
    htmlTemplate = htmlTemplate.replace(/{__COLOR__}/g, this.__color);
    htmlTemplate = htmlTemplate.replace(
      /{__STROKE_WIDTH__}/g,
      String(this.__strokeWidth)
    );

    this.__webView.loadHTML(htmlTemplate);
  }
}
