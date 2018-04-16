const System = require('sf-core/device/system');

Object.assign(exports, {
    setMaxtLenth
});


function setMaxtLenth(textBox, maxLength, onTextChange) {
    const state = {
        text: textBox.text,
        start: textBox.cursorPosition.start,
        end: textBox.cursorPosition.end
    };
    var maxLengthFunction = null;
    if (System.OS === "Android") {
        textBox.android.maxLength(maxLength);
    }
    else {
        maxLengthFunction = maxLenghtFilter.bind(textBox, state, maxLength);
    }
    textBox.onTextChanged = onTextChanged.bind(textBox, textBox.onTextChanged && textBox.onTextChanged.bind(textBox),
        maxLengthFunction, onTextChange && onTextChange.bind(textBox));
}


function onTextChanged(superOnTextChanged, maxLenghtFilter, userOnTextChange, e) {
    superOnTextChanged && superOnTextChanged(e);
    maxLenghtFilter && maxLenghtFilter(e);
    userOnTextChange && userOnTextChange(e);
}

function maxLenghtFilter(state, maxLength, e) {
    const textBox = this;

    if (textBox.text.length > maxLength) {
        textBox.text = state.text;
        textBox.cursorPosition = {
            start: e.location,
            end: e.location
        };
    }
    else {
        Object.assign(state, {
            text: textBox.text
        }, this.cursorPosition);
    }

}
