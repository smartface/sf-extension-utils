const System = require('sf-core/device/system');

function setMaxtLenth(textBox, maxLength, onTextChange) {
    var maxLengthFunction = null;
    if (System.OS === "Android") {
        textBox.maxLength(maxLength);
    }
    else {
        maxLengthFunction = maxLenghtFilter.bind(textBox, maxLength);
    }
    textBox.onTextChanged = onTextChanged.bind(textBox, textBox.onTextChanged && textBox.onTextChanged.bind(textBox),
        maxLengthFunction, onTextChange && onTextChange.bind(textBox));
}


function onTextChanged(superOnTextChanged, maxLenghtFilter, userOnTextChange, e) {
    superOnTextChanged && superOnTextChanged(e);
    maxLenghtFilter && maxLenghtFilter(e);
    userOnTextChange && userOnTextChange(e);
}

function maxLenghtFilter(maxLength, e) {
    
}
