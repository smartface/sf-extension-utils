/**
 * @module CircularProgressBar
 * @type {Object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2020
 */

/**
 * @function
 * Renders circle shaped progress bar in a WebView
 * 
 * @param {object} options - Cofiguration of circular progress bar (required)
 * @param {object} options.webView - WebView instance to render the progress bar (required)
 * @param {number} [options.strokeWidth = 4] - Width of the stroke
 * @param {string} [options.color = #555] - Stroke color
 * @param {number} [options.duration = 2] - Duration for animation in seconds
 * @param {string} [options.trailColor = #eee] - Color for lighter trail stroke underneath the actual progress path
 * @param {number} [options.trailWidth = 4] - Width of the trail stroke
 * @param {number} [options.width = 100] - Size of the progress bar (both width & height)
 *
 * @example
 * import CircularProgressBar from "sf-extension-utils/lib/art/CircularProgressBar";
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
 *
 */
class CircularProgressBar {
    constructor(options = {}) {
        this.__strokeWidth = options.strokeWidth || 4; // Width of the stroke
        this.__duration = options.duration || 2; // Duration for animation in seconds
        this.__color = options.color || '#555'; // Stroke color
        this.__trailColor = options.trailColor || '#eee'; // Color for lighter trail stroke underneath the actual progress path
        this.__trailWidth = options.trailWidth || 4; // Width of the trail stroke
        this.__width = options.width || 100; // Size of the progress bar (both width & height)
        this.__webView = options.webView;

        if (!this.__webView) {
            throw new Error("webView parameter is required");
        }
    }

    /**
     * Current shown progress from 0 to 100. This can be get and set.
     * @property {number} value
     */
    set value(val) {
        this.__value = val;
        this.render(); 
    }

    get value() {
        return this.__value;
    }

    static __calculateCurrentDashoffset(currentValue) {
        const RADIUS = 54;
        const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
        return CIRCUMFERENCE * (1 - currentValue / 100);
    }

    render() {
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

        htmlTemplate = htmlTemplate.replace(/{__DASHOFFSET__}/g, CircularProgressBar.__calculateCurrentDashoffset(this.__value));
        htmlTemplate = htmlTemplate.replace(/{__DURATION__}/g, this.__duration);
        htmlTemplate = htmlTemplate.replace(/{__WIDTH__}/g, this.__width);
        htmlTemplate = htmlTemplate.replace(/{__TRAIL_WIDTH__}/g, this.__trailWidth);
        htmlTemplate = htmlTemplate.replace(/{__TRAIL_COLOR__}/g, this.__trailColor);
        htmlTemplate = htmlTemplate.replace(/{__COLOR__}/g, this.__color);
        htmlTemplate = htmlTemplate.replace(/{__STROKE_WIDTH__}/g, this.__strokeWidth);

        this.__webView.loadHTML(htmlTemplate);
    }
}

exports = module.exports = CircularProgressBar;
