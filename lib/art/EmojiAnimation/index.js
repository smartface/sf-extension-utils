/**
 * @module EmojiAnimation
 * @type {Object}
 * @author Ali Tugrul Pinar <ali.pinar@smartface.io>
 * @copyright Smartface 2020
 */

/**
 * @function
 * Play emojis with animation effects
 *
 * @param {object} options - Cofiguration of emoji animation (required)
 * @param {object} options.webView - WebView instance to render animation effects (required)
 * @param {number} [options.emojis = []] - Array of emojis (base64 images)
 * @param {number} [options.emojiBoxWidth = 100px] - Width of emoji box
 * @param {number} [options.emojiBoxHeight = 80px] - Heght of emoji box
 *
 * @example
 * import EmojiAnimation from "@smartface/extension-utils/lib/art/EmojiAnimation";
 *
 * const emojiAnimation = new EmojiAnimation({
 *     webView: this.webViewComponent,
 *     emojis: ["data:image/png;base64,iVBs4c6QAAORw0KGgoAAAANSUh"]
 * });
 *
 * // Play first emoji on webview with 3 second animation
 * emojiAnimation.playEmoji(0, 3);
 *
 */

const smileyBase64 = `data:image/png;base64,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`;

const css = (emojiBoxWidh, emojiWidth) => `
.particle-box {
  width: ${emojiBoxWidh}px;
  right: 0;
  bottom: 0;
  top: 0;
  position: absolute;
}

div.particle {
    width: ${emojiBoxWidh}px;
    height: 80px; 
    opacity: 1;
    position: absolute;
    bottom: 0;
    right: 0;
    display: none;
}
div.particle img {
    position: absolute;
    width: ${emojiWidth}px;
    left: 0px;
    right: 0px;
    top: 0px;
    margin: auto;
    opacity: 1;
}
@keyframes flowOne {
    0% {
        opacity: 1;
        bottom: 0%;
        left: 31%;
    }
    40% {
        opacity: 0.9;
    }
    50% {
        opacity: 1;
        left: 5%;
    }
    60% {
        opacity: 0.7;
    }
    80% {
        bottom: 60%;
    }
    100% {
        opacity: 0;
        bottom: 80%;
        left: 22%;
    }
}
@keyframes flowTwo {
	0% {
		opacity: 0.3;
		bottom: 0%;
		left: 0%;
	}
	40% {
		opacity: 0.9;
	}
	50% {
		opacity: 1;
		left: 22%;
	}
	60% {
		opacity: 0.7;
	}
	80% {
        bottom: 60%;
        left: 5%;
	}
	100% {
		opacity: 0;
		bottom: 80%;
		left: 0%;
	}
}
@keyframes flowThree {
	0% {
		opacity: 0.6;
		bottom: 0%;
		left: 5%;
	}
	40% {
		opacity: 0.9;
	}
	50% {
		opacity: 1;
		left: 44%;
	}
	60% {
		opacity: 0.7;
	}
	80% {
        left: 12%;
		bottom: 70%;
	}
	100% {
		opacity: 0;
		bottom: 80%;
		left: 0%;
	}
}
@keyframes flowFour {
	0% {
		opacity: 0.1;
		bottom: 0%;
		left: 5%;
	}
	40% {
        opacity: 0.9;
        left: 11%;
	}
	50% {
		opacity: 1;
	}
	60% {
		opacity: 0.7;
	}
	80% {
        bottom: 70%;
        left: 19%;
	}
	100% {
		opacity: 0;
		bottom: 80%;
		left: 0%;
	}
}
`;

const jsHeart = `
window.__smileyBase64 = "${smileyBase64}";
function animateEmoji(emojiIndex, timing) {
  // Init
  var rand = Math.floor(Math.random() * 100 + 1);
  var flows = ["flowOne", "flowTwo", "flowThree", "flowFour"];
  var colors = ["colOne", "colTwo", "colThree", "colFour", "colFive", "colSix"];
  // Animate Particle
  var emoji = window.__emojis[emojiIndex] || window.__smileyBase64;
  $(
    '<div class="particle part-' +
      rand +
      " " +
      colors[Math.floor(Math.random() * 6)] +
      '" style="font-size:' +
      Math.floor(Math.random() * (30 - 22) + 22) +
      'px;"><img src="' + emoji +'"/></div>'
  )
    .appendTo(".particle-box")
    .css({
      animation:
        "" + flows[Math.floor(Math.random() * 4)] + " " + timing.toString() + "s linear"
    });
  $(".part-" + rand).show();
  // Remove Particle
  setTimeout(function() {
    $(".part-" + rand).remove();
  }, timing * 1000 - 100);
}

window.animateEmoji = animateEmoji;
`;

class EmojiAnimation {
	constructor(options = {}) {
		this.__emojis = options.emojis; // Array of emojis will be played

		this.__emojiBoxWidth = options.emojiBoxWidth || 100; // Width of emoji box(px)
		this.__emojiWidth = options.emojiWidth || 80; // Width of emoji(px)
		/*
        this.__trailColor = options.trailColor || '#eee'; // Color for lighter trail stroke underneath the actual progress path
        this.__trailWidth = options.trailWidth || 4; // Width of the trail stroke
        this.__width = options.width || 100; // Size of the progress bar (both width & height)
        */
		this.__webView = options.webView;
		if (!this.__webView) {
			throw new Error('webView parameter is required');
		}

		this.__webView.loadHTML(`
            <html> 
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <body style="margin: 0px; padding: 0px;"><script type="text/javascript" >${jsHeart}</script><script type="text/javascript" >window.__emojis=${JSON.stringify(
			this.__emojis
		)}</script>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
            <style> ${css(
				this.__emojiBoxWidth,
				this.__emojiWidth
			)} </style>     
            <!-- Start Content -->
            <div id="id1" class="particle-box"></div>
            <!-- End Content --> 
        </body>
        </html>`);
		this.__webView.onError = (e) => {
			console.error(e);
		};
		this.__webView.touchEnabled = false;
		this.__webView.scrollBarEnabled = false;
		this.__webView.onShow = () => {};
		this.__webView.android['onConsoleMessage'] = (e) => {
			console.info('WBV: ', e.message);
		};
	}

	playEmoji(emojiIndex, timing) {
		this.__webView.evaluateJS(
			`window.animateEmoji(${emojiIndex}, ${timing});`,
			(e) => {}
		);
	}
}

exports = module.exports = EmojiAnimation;
