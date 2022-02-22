//@ts-nocheck
import AttributedString from "@smartface/native/global/attributedstring";

export function isEqualProps(a: AttributedString, b: AttributedString) {
	return (
		a.underline === b.underline &&
		a.backgroundColor === b.backgroundColor &&
		a.foregroundColor === b.foregroundColor &&
		a.link === b.link &&
		isEqualFontProps(a.font, b.font) &&
    (a.ios && b.ios
        ? a.ios.underlineColor === b.ios.underlineColor &&
        a.ios.strikethroughColor === b.ios.strikethroughColor
        : !a.ios && !b.ios)
	);
}

export function isEqualFontProps(a: AttributedString['font'], b: AttributedString['font']) {
	if (a && b) {
		return (
			a.bold === b.bold &&
			a.italic === b.italic &&
			a.style === b.style &&
			a.family === b.family &&
			a.size === b.size
		);
	} else if (!a && !b) return true;
	return false;
}

export function clearProps(t: AttributedString) {
	delete t.value;
	t.backgroundColor === "transparent" && delete t.backgroundColor;
	t.underline &&
		t.underlineColor &&
		(t.ios = { underlineColor: t.underlineColor });
	t.strikethroughColor &&
		(t.ios = Object.assign(t.ios || {}, {
			strikethroughColor: t.strikethroughColor,
		}));
	delete t.underlineColor;
	delete t.strikethroughColor;
	return t;
}

export function updateTextDecorationColors(t) {
	if (t.underline && !t.underlineColor) {
		t.underlineColor = t.foregroundColor || "#000000";
	}
	if (t.strikethrough && !t.strikethroughColor) {
		t.strikethroughColor = t.foregroundColor || "#000000";
	}
}

export function isPlainAttributedText(t) {
	return (
		!t.backgroundColor &&
		!t.foregroundColor &&
		!t.underline &&
		!t.ios &&
		!t.font
	);
}