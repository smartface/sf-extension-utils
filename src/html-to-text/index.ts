//@ts-nocheck

/**
 * Smartface html-to-text util
 * @module html-to-text
 * @type {Class}
 * @author Furkan Arabacı <furkan.arabaci@smartface.io>
 * @author Ali Tuğrul Pınar <ali.pinar@smartface.io>
 * @copyright Smartface 2021
 */

import HTML from 'html-parse-stringify';
import AttributedString from "@smartface/native/ui/attributedstring";
import propFactory from "@smartface/contx/lib/smartface/sfCorePropFactory";

import * as util from 'html-to-text/util';

let lastTextNode: any = null;

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
	? A
	: never;

/**
 * This method automatically maps necessary attributedstring variables. Use this if you don't have Dark theme support or you want the attributedstrings as is.
 * Consider reading this documentation before passing an html: https://github.com/smartface/@smartface/extension-utils/blob/master/doc/html-to-text.md
  *  @example
        import TextView from '@smartface/native/ui/textview';
        import { createAttributedStrings } from "sf-extenstion-utils/lib/html-to-text");
        import AttributedString from "@smartface/native/ui/attributedstring";
        import propFactory from "@smartface/contx/lib/smartface/sfCorePropFactory";

        const textView = new TextView();
        const htmlSource = "<span style=\"font-size: 24px; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\"><span style=\"font-family: Nunito-LightItalic; font-size: 24px; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">Your </span><font face=\"ios-Default-Bold\" style=\"font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">attributed </font><span style=\"text-decoration-line: underline; color: rgb(139, 87, 42); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; text-decoration-color: rgb(0, 0, 0);\">Stri<span style=\"color: rgb(139, 87, 42); text-decoration-line: underline ; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent;\">ngs</span></span></span><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224);\">second</span></span></span></div><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 16px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224); color: rgb(248, 231, 28);\">Third</span></span></span></div>";
        const attributedStrings = createAttributedTexts(htmlSource);
        textView.attributedText = attributedStrings.map(s => new AttributedString(propFactory(s)));
  * @param {string} htmlSource - Your html content to work with. The limitations and rules are specified in the document of this module.
  * @returns {Array.<AttributedString>}
  */
export function createAttributedTexts(htmlSource: string): AttributedString[] {
	const spannedHtmlSource = `<span>${htmlSource}</span>`;
	const ast = HTML.parse(spannedHtmlSource.replace(/<br>/gim, "\n"));
	const tree = getParsedTree(ast[0]);
	lastTextNode = null;
	const attributedStringsFromTree = getAttributedStringsFromTree(tree);
	return attributedStringsFromTree.map(
		(s) => new AttributedString(propFactory(s))
	);
}

/**
 * This method returns half-baked attributedstring value. Use this method if you support dark theme to change foregroundColor or if you want to tweak other properties.
 * Consider reading this documentation before passing an html: https://github.com/smartface/@smartface/extension-utils/blob/master/doc/html-to-text.md
 *  @example
        import TextView from '@smartface/native/ui/textview';
        import { createAttributedStrings } from "sf-extenstion-utils/lib/html-to-text");

        const textView = new TextView();
        const htmlSource = "<span style=\"font-size: 24px; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\"><span style=\"font-family: Nunito-LightItalic; font-size: 24px; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">Your </span><font face=\"ios-Default-Bold\" style=\"font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; color: rgb(0, 0, 0); text-decoration-color: rgb(0, 0, 0);\">attributed </font><span style=\"text-decoration-line: underline; color: rgb(139, 87, 42); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent; text-decoration-color: rgb(0, 0, 0);\">Stri<span style=\"color: rgb(139, 87, 42); text-decoration-line: underline ; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: transparent;\">ngs</span></span></span><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 24px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224);\">second</span></span></span></div><div><span style=\"font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; font-size: 16px; font-family: ios-Default-Regular; text-decoration-color: rgb(0, 0, 0);\"><span style=\"text-decoration-line: underline; text-decoration-color: rgb(0, 0, 0); font-size: 16px; font-family: ios-Default-Regular; background-color: rgb(189, 16, 224); color: rgb(248, 231, 28);\">Third</span></span></span></div>";
        textView.attributedText = createAttributedStrings(htmlSource);
 * @param {string} htmlSource - Your html content to work with. The limitations and rules are specified in the document of this module.
 * @returns {Array.<AttributedString>}
 */
export function createAttributedStrings(
	htmlSource: string
): ArgumentTypes<typeof propFactory>[0] {
  const spannedHtmlSource = `<span>${htmlSource}</span>`;
  const ast = HTML.parse(spannedHtmlSource.replace(/<br>/gim, '\n'));
  const tree = getParsedTree(ast[0]);
  lastTextNode = null;
  return getAttributedStringsFromTree(tree);
}


function getParsedTree(ast: any, parent?: any) {
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

function getParsedStyleObject(style: any) {
  const res = {};
  const styles = style.split(';');
  styles.forEach((item: any) => {
      const oneStyle = item.trim().split(': ');
      oneStyle.length === 2 && ((res as any)[oneStyle[0]] = oneStyle[1]);
  });
  return res;
}

function getAttributedStringsFromTree(tree: any, resStrings?: AttributedString[]) {
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
