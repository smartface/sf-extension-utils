import WebView from 'sf-core/ui/webview';
import WebViewBridge from '../webviewbridge';

declare enum StyleTypesEnum {
    width = "width",
    height = "height",
    margin = "margin",
    marginLeft = "margin-left",
    marginRight = "margin-right",
    marginBottom = "margin-bottom",
    marginTop = "margin-top",
    padding = "padding",
    paddingLeft = "padding-left",
    paddingRight = "padding-right",
    paddingBottom = "padding-bottom",
    paddingTop = "padding-top",
    color = "color",
    background = "background",
    backgroundColor = "background-color",
    fontSize = "font-size",
    fontWeight = "font-weight",
    fontFamily = "font-family",
    border = "border",
    borderLeft = "border-left",
    borderRight = "border-right",
    borderBottom = "border-bottom",
    borderTop = "border-top",
    alignItems = "align-items",
    justifyContent = "justify-content",
    diplay = "display",
    position = "position",
    left = "left",
    right = "right",
    bottom = "bottom",
    top = "top",
    zIndex = "z-index"
}

declare class Styles {
    width?: string;
    height?: string;
    margin?: string;
    marginLeft?: string;
    marginRight?: string;
    marginBottom?: string;
    marginTop?: string;
    padding?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingTop?: string;
    color?: string;
    background?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    border?: string;
    alignItems?: string;
    justifyContent?: string;
    diplay?: string;
    position?: string;
    left?: string;
    right?: string;
    bottom?: string;
    top?: string;
    zIndex?: string;
}

declare class ColumnOptions {
    key: string;
    columnClass?: string;
    columnStyles?: Styles;
}

declare class RowOptions {
    rowStyles?: Styles;
    rowClass?: string;
    columns?: ColumnOptions[];
}

declare class TableOptions {
    styleLinks?: string[];
    externalStyles?: string;
    tableClass?: string;
    tableStyles?: Styles;
    rows?: RowOptions[];
}

declare class TableInitOptions {
    webView: WebView | WebViewBridge;
    tableOptions: TableOptions;
}

export default class Table extends TableInitOptions {
    styleTypes: StyleTypesEnum;
    constructor(options: TableInitOptions);
    render(): void;
}