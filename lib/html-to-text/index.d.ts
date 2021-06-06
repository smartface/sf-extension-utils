/**
 * Smartface html-to-text util
 * @module html-to-text
 * @type {Class}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @author Ali Tuğrul Pınar <ali.pinar@smartface.io>
 * @copyright Smartface 2021
 */

import AttributedString from '@smartface/native/ui/attributedstring';
import propFactory from '@smartface/contx/lib/smartface/sfCorePropFactory';

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;


/**
 * This method automatically maps necessary attributedstring variables. Use this if you don't have Dark theme support or you want the attributedstrings as is.
 * Consider reading this documentation before passing an html: https://github.com/smartface/sf-extension-utils/blob/master/doc/html-to-text.md
  *  @example
        import TextView from '@smartface/native/ui/textview';
        import { createAttributedStrings } from "sf-extenstion-utils/lib/html-to-text");
        import AttributedString from "@smartface/native/ui/attributedstring";
        import propFactory from "@smartface/contx/lib/smartface/sfCorePropFactory";

        const textView = new TextView();
        const htmlSource = "<span style=\"font-size: 24px; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\"><span style=\"font-family: Nunito-LightItalic; font-size: 24px; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">Your </span><font face=\"ios-Default-Bold\" style=\"font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">attributed </font><span style=\"text-decoration-line: underline; color: rgb(139, 87, 42); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; text-decoration-color: rgb(0, 0, 0);\">Stri<span style=\"color: rgb(139, 87, 42); text-decoration-line: underline ; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent;\">ngs</span></span></span><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224);\">second</span></span></span></div><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 16px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224); color: rgb(248, 231, 28);\">Third</span></span></span></div>";
        const attributedStrings = createAttributedStrings(htmlSource);
        textView.attributedText = attributedStrings.map(s => new AttributedString(propFactory(s)));
  * @param {string} htmlSource - Your html content to work with. The limitations and rules are specified in the document of this module.
  * @returns {Array.<AttributedString>}
  */
export function createAttributedTexts(htmlSource: string): AttributedString[];

/**
 * This method returns half-baked attributedstring value. Use this method if you support dark theme to change foregroundColor or if you want to tweak other properties.
 * Consider reading this documentation before passing an html: https://github.com/smartface/sf-extension-utils/blob/master/doc/html-to-text.md
 *  @example
        import TextView from '@smartface/native/ui/textview';
        import { createAttributedStrings } from "sf-extenstion-utils/lib/html-to-text");

        const textView = new TextView();
        const htmlSource = "<span style=\"font-size: 24px; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\"><span style=\"font-family: Nunito-LightItalic; font-size: 24px; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">Your </span><font face=\"ios-Default-Bold\" style=\"font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">attributed </font><span style=\"text-decoration-line: underline; color: rgb(139, 87, 42); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; text-decoration-color: rgb(0, 0, 0);\">Stri<span style=\"color: rgb(139, 87, 42); text-decoration-line: underline ; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent;\">ngs</span></span></span><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224);\">second</span></span></span></div><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 16px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224); color: rgb(248, 231, 28);\">Third</span></span></span></div>";
        textView.attributedText = createAttributedStrings(htmlSource);
 * @param {string} htmlSource - Your html content to work with. The limitations and rules are specified in the document of this module.
 * @returns {Array.<AttributedString>}
 */
export function createAttributedStrings(htmlSource: string): ArgumentTypes<typeof propFactory>[0]; // [string, number];
