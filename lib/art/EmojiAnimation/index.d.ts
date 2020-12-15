import WebView = require('sf-core/ui/webview');

declare type Emoji = {
	base64: string;
	width: number;
	height: number;
};

declare class EmojiAnimationOptions {
	/**
	 * Should be an instance of sf-core/ui/webview
	 * @see https://developer.smartface.io/docs/webview
	 */
	webView: WebView;
	/**
	 * @default []
	 * Array of emojis will be played
	 */
	emojis?: Emoji[];
}

/**
 * @class
 * @author Ali Tugrul Pinar <ali.pinar@smartface.io>
 * @copyright Smartface 2020
 * @example
 * import EmojiAnimation from 'sf-extension-utils/lib/art/EmojiAnimation';
 *
 * const emojiAnimation = new EmojiAnimation({
 *     emojis: [{
 *          base64: 'data:image/base64:eymBASDASd',
 *          width: 40,
 *          height: 40
 *      }],
 *     webView: this.wvCircularAnimation
 * });
 *
 * // Play first emoji on WebView
 * emojiAnimation.play(0);
 */
export default class EmojiAnimation extends EmojiAnimationOptions {
	constructor(options: EmojiAnimationOptions);
	/**
	 * Play given index that emoji on WebView
	 */
	public playEmoji(emojiIndex: number);
}
