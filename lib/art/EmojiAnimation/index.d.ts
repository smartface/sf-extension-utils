import WebView = require('@smartface/native/ui/webview');

declare class EmojiAnimationOptions {
	/**
	 * Should be an instance of @smartface/native/ui/webview
	 * @see https://developer.smartface.io/docs/webview
	 */
	webView: WebView;
	/**
	 * @default []
	 * Array of emojis will be played
	 */
	emojis?: string[];
	/**
	 * @default 100
	 * Width of emoji box(px)
	 */
	emojiBoxWidth?: number;
	/**
	 * @default 80
	 * Width of emoji(px)
	 */
	emojiWidth?: number;
}

/**
 * @class
 * @author Ali Tugrul Pinar <ali.pinar@smartface.io>
 * @copyright Smartface 2020
 * @example
 * import EmojiAnimation from '@smartface/extension-utils/lib/art/EmojiAnimation';
 *
 * const emojiAnimation = new EmojiAnimation({
 *     emojis: ['data:image/base64:eymBASDASd']
 *     webView: this.wvCircularAnimation
 * });
 *
 * // Play first emoji on WebView with 3 second animation
 * emojiAnimation.play(0, 3);
 */
export default class EmojiAnimation extends EmojiAnimationOptions {
	constructor(options: EmojiAnimationOptions);
	/**
	 * Play given index that emoji on WebView
	 */
	public playEmoji(emojiIndex: number, timing: number);
}
