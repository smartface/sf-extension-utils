/**
 * @module CircularProgressBar
 * @type {Object}
 * @author Ozcan Ovunc <ozcan.ovunc@smartface.io>
 * @copyright Smartface 2020
 */

class CircularProgressBar {
    constructor(options = {}) {
        this.strokeWidth = options.strokeWidth || 4;
        this.duration = options.duration || 2;
        this.color = options.color || '#555';
        this.trailColor = options.trailColor || '#eee';
        this.trailWidth = options.trailWidth || 4;
        this.width = options.width || 100;

        if (!this.webView) {
            throw new Error("webView parameter is required");
        }
    }

    set value(val) {
        this.value = val;
        this.render(); 
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
            animation: progress ${__DURATION__}s;
            stroke-linecap: round;
            }

            @keyframes progress {
            from {
                stroke-dashoffset: 339.292;
            }

            to {
                stroke-dashoffset: ${__DASHOFFSET__};
            }
            }
        </style>
        </head>

        <body style="margin: 0px; padding: 0px;">
        <div class="demo">
            <svg class="progress" width="${__WIDTH__}" height="${__WIDTH__}" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="${__COLOR__}" stroke-width="${__STROKE_WIDTH__}" />
            <circle class="progress__value" cx="60" cy="60" r="54" fill="none" stroke="${__TRAIL_COLOR__}" stroke-width="${__TRAIL_WIDTH__}"
                style="stroke-dashoffset: ${__DASHOFFSET__};"></circle>
            </svg>
        </div>
        </body>
        </html>
        `;

        htmlTemplate = htmlTemplate.replace(/\${__DASHOFFSET__}/g, __calculateCurrentDashoffset(this.value));
        htmlTemplate = htmlTemplate.replace(/\${__DURATION__}/g, this.duration);
        htmlTemplate = htmlTemplate.replace(/\${__WIDTH__}/g, this.width);
        htmlTemplate = htmlTemplate.replace(/\${__TRAIL_WIDTH__}/g, this.trailWidth);
        htmlTemplate = htmlTemplate.replace(/\${__TRAIL_COLOR__}/g, this.trailColor);
        htmlTemplate = htmlTemplate.replace(/\${__COLOR__}/g, this.color);
        htmlTemplate = htmlTemplate.replace(/\${__STROKE_WIDTH__}/g, this.strokeWidth);

        this.webView.loadHTML(htmlTemplate);
    }
}
