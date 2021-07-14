/**
 * Smartface html-to-text util
 * @module html-to-text
 * @type {Class}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @author Ali Tuğrul Pınar <ali.pinar@smartface.io>
 * @copyright Smartface 2021
 */

/**
 * When you have a html, but don't want to create a WebView to render the texts, this utility is what you are looking for.
 * However, converting html to native Smartface component has their own limitations. If not, the result may not be the desired one.
 * 
 * ## Limitations & Rules
 * 
 *   1. If you want to write **newline** character, you can use these tags **\<br\>**, **\<div\>** or use "\n".
 *       - "attributed \<br\> string"
 *       - "attributed \<div\> string\</div\>"
 *       - "attributed \n string"
 *
 *   2. You can use following html tags
 *       - **br**     → newline
 *       - **div**    → newline and general tag for styling
 *       - **span**   → general tag for styling
 *       - **font**   → has attribute as color(**color**), size(**font-size**) and face(**font-family**)
 *       - **b**      → bold style
 *       - **u**      → underline style
 *       - **i**      → italic style
 *       - **a**      → has attribute **href** for link.
 *       - **s**      → line-through
 *       - **strike** → line-through
 *
 *   3. You can only use following css styles
 *       - font.family-style      → **font-family** → ```"font-family: Nunito-ExtraBold;"```
 *       - font.italic            → **font-style** → ```"font-style: italic;"```
 *       - font.size              → **font-size** → ```"font-size: 24px;" (24pt, 24dp)```
 *       - font.bold              → **font-weight** → ```"font-weight: bold;"```
 *       - foregroundColor        → **color** → ```"color: rgb(127, 125, 127);"```
 *       - backgroundColor        → **background-color** → ```"background-color: rgb(255, 125, 127);"```
 *       - underline              → **text-decoration-line** → ```"text-decoration-line: underline;"```
 *       - strikethrough          → **text-decoration-line** → ```"text-decoration-line: line-through;"```
 *       - link                   → **href** → ```"click <a href=\"https://smartface.io\"> here </a> "```
 *       - ios.underlineColor     → **text-decoration-color** → ```"text-decoration-color: rgba(255, 125, 128);"```
 *       - ios.strikethroughColor → **text-decoration-color** → ```"text-decoration-color: rgba(24, 126, 168);"```
 *
 *   4. ⚠️ If you give **font-family** style, this style can overwrite **font-weight** and **font-style**.
 *       - font-family: **Nunito-ExtraLightItalic**; → this overwrite **font-weight** as normal.
 */

const HTML = require('html-parse-stringify');
const AttributedString = require('@smartface/native/ui/attributedstring');
const propFactory = require('@smartface/contx/lib/smartface/sfCorePropFactory').default;

const util = require('./util');

let lastTextNode = null;

/**
 * This method automatically maps necessary attributedstring variables. Use this if you don't have Dark theme support or you want the attributedstrings as is.
 *  @example
import TextView from '@smartface/native/ui/textview';
import { createAttributedStrings } from "sf-extenstion-utils/lib/html-to-text");

const textView = new TextView();
const htmlSource = "<span style=\"font-size: 24px; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\"><span style=\"font-family: Nunito-LightItalic; font-size: 24px; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">Your </span><font face=\"ios-Default-Bold\" style=\"font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">attributed </font><span style=\"text-decoration-line: underline; color: rgb(139, 87, 42); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; text-decoration-color: rgb(0, 0, 0);\">Stri<span style=\"color: rgb(139, 87, 42); text-decoration-line: underline ; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent;\">ngs</span></span></span><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224);\">second</span></span></span></div><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 16px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224); color: rgb(248, 231, 28);\">Third</span></span></span></div>";
textView.attributedText = createAttributedTexts(htmlSource);
 * @param {string} htmlSource - Your html content to work with. The limitations and rules are specified in the document of this module.
 * @returns {Array.<AttributedString>}
 */
function createAttributedTexts(htmlSource) {
    const spannedHtmlSource = `<span>${htmlSource}</span>`;
    const ast = HTML.parse(spannedHtmlSource.replace(/<br>/gim, '\n'));
    const tree = getParsedTree(ast[0]);
    lastTextNode = null;
    const attributedStringsFromTree = getAttributedStringsFromTree(tree);
    return attributedStringsFromTree.map((s) => new AttributedString(propFactory(s)));
}

/**
 * This method returns half-baked attributedstring value. Use this method if you support dark theme to change foregroundColor or if you want to tweak other properties.
 *  @example
import TextView from '@smartface/native/ui/textview';
import { createAttributedStrings } from "sf-extenstion-utils/lib/html-to-text");
import AttributedString from "@smartface/native/ui/attributedstring";
import propFactory from "@smartface/contx/lib/smartface/sfCorePropFactory";

const textView = new TextView();
const htmlSource = "<span style=\"font-size: 24px; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\"><span style=\"font-family: Nunito-LightItalic; font-size: 24px; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">Your </span><font face=\"ios-Default-Bold\" style=\"font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">attributed </font><span style=\"text-decoration-line: underline; color: rgb(139, 87, 42); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; text-decoration-color: rgb(0, 0, 0);\">Stri<span style=\"color: rgb(139, 87, 42); text-decoration-line: underline ; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent;\">ngs</span></span></span><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224);\">second</span></span></span></div><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 16px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224); color: rgb(248, 231, 28);\">Third</span></span></span></div>";
const attributedStrings = createAttributedStrings(htmlSource);
textView.attributedText = attributedStrings.map(s => new AttributedString(propFactory(s))); // Or edit inside of map function
 * @param {string} htmlSource - Your html content to work with. The limitations and rules are specified in the document of this module.
 * @returns {Array.<AttributedString>}
 */
function createAttributedStrings(htmlSource) {
    const spannedHtmlSource = `<span>${htmlSource}</span>`;
    const ast = HTML.parse(spannedHtmlSource.replace(/<br>/gim, '\n'));
    const tree = getParsedTree(ast[0]);
    lastTextNode = null;
    return getAttributedStringsFromTree(tree);
}


function getParsedTree(ast, parent) {
    const res = { children: [] };
    if (!ast) return res;

    res.style = Object.assign(
        {},
        parent && parent.style ? parent.style : {},
        ast.attrs && ast.attrs.style ? getParsedStyleObject(ast.attrs.style) : {}
    );

    if (ast.attrs) {
        if (ast.attrs.color) res.style.color = ast.attrs.color;
        if (ast.attrs.face) res.style['font-family'] = ast.attrs.face;
        if (ast.attrs.size) res.style['font-size'] = ast.attrs.size;
        if (ast.attrs.href) res.style['href'] = ast.attrs.href;
    }

    if (ast.type === 'text') {
        res.value = ast.content;
        lastTextNode = res;
    } else if (ast.type === 'tag') {
        if (ast.name === 'br' || ast.name === 'div')
            lastTextNode && (lastTextNode.value += '\n');
        else if (ast.name === 'u') res.style['text-decoration-line'] = 'underline';
        else if (ast.name === 'b') res.style['font-weight'] = 'bold';
        else if (ast.name === 'i') res.style['font-style'] = 'italic';
        else if (ast.name === 'strong') res.style['font-weight'] = 'bold';
        else if (ast.name === 's' || ast.name === 'strike') {
            res.style.strike = true;
            ast.attrs.style.color &&
                (res.style.strikethroughColor = ast.attrs.style.color);
        }
    }
    if (ast.voidElement === false) {
        ast.children.forEach((c) => res.children.push(getParsedTree(c, res)));
    }
    return res;
}

function getParsedStyleObject(style) {
    const res = {};
    const styles = style.split(';');
    styles.forEach((item) => {
        const oneStyle = item.trim().split(': ');
        oneStyle.length === 2 && (res[oneStyle[0]] = oneStyle[1]);
    });
    return res;
}

function getAttributedStringsFromTree(tree, resStrings) {
    resStrings = resStrings || [];

    let obj = { font: {} };

    if (tree.value) {
        if (tree.style['font-family']) {
            const parsedFamily = tree.style['font-family'].split(/_|-/);
            parsedFamily.length === 3 && parsedFamily.shift();
            parsedFamily[0] &&
                Object.assign(obj, {
                    font: {
                        family: parsedFamily[0],
                    },
                });
            if (parsedFamily[1]) {
                obj.font.style = parsedFamily[1];
                obj.font.bold = /bold/i.test(obj.font.style);
                obj.font.italic = /italic/i.test(obj.font.style);
            }
        }
        tree.style['href'] && (obj.link = tree.style['href']);
        tree.style['font-size'] &&
            (obj.font.size = Math.floor(parseFloat(tree.style['font-size'])));
        tree.style['font-weight'] &&
            (obj.font.bold = tree.style['font-weight'] === 'bold');
        tree.style['font-style'] &&
            (obj.font.italic = tree.style['font-style'] == 'italic');

        tree.style['background-color'] &&
            (obj.backgroundColor = tree.style['background-color']);
        tree.style['color'] && (obj.foregroundColor = tree.style['color']);

        tree.style['text-decoration-line'] &&
            tree.style['text-decoration-line'].indexOf('underline') !== -1 &&
            (obj.underline = true);
        tree.style['text-decoration-color'] &&
            (obj.underlineColor = tree.style['text-decoration-color']);

        if (
            tree.style.strike ||
            (tree.style['text-decoration-line'] &&
                tree.style['text-decoration-line'].indexOf('line-through') !== -1)
        ) {
            obj.strikethrough = true;
            tree.style['text-decoration-color'] &&
                (obj.strikethroughColor = tree.style['text-decoration-color']);
            tree.style.strikethroughColor &&
                (obj.strikethroughColor = tree.style.strikethroughColor);
        }

        obj.string = tree.value;
        Object.keys(obj.font).length === 0 && delete obj.font;
        util.updateTextDecorationColors(obj);
        obj = util.clearProps(obj);
        if (
            resStrings.length &&
            util.isEqualProps(resStrings[resStrings.length - 1], obj)
        ) {
            resStrings[resStrings.length - 1].string += obj.string;
        } else {
            resStrings.push(obj);
        }
    }
    tree.children.forEach((t) => {
        getAttributedStringsFromTree(t, resStrings);
    });

    return resStrings;
}

module.exports = exports = {
    createAttributedStrings,
    createAttributedTexts
};
