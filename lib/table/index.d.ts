/**
 * @module Table
 * @type {object}
 * @author Berk Baski <berk.baski@smartface.io>
 * @copyright Smartface 2021
 */

import WebView from 'sf-core/ui/webview';
import WebViewBridge from '../webviewbridge';

/** Web equivalent of CSS properties */
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

/** CSS properties available within this component */
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

/** Properties of columns in the row */
declare class ColumnOptions {
    /** Value of column */
    key: string;

    /** Class of column */
    columnClass?: string;

    /** Inline style of column */
    columnStyles?: Styles;
}

/** Properties of rows in the table */
declare class RowOptions {
    /** Inline style of row */
    rowStyles?: Styles;

    /** Class of row */
    rowClass?: string;

    /** Columns in the row */
    columns?: ColumnOptions[];
}

/** Options for creating a table */
declare class TableOptions {
    /** **link** elements to add to the header of the page */
    styleLinks?: string[];

    /** External styles to add to the page's **style** element */
    externalStyles?: string;

    /** Class of table */
    tableClass?: string;

    /** Inline style of table */
    tableStyles?: Styles;

    /** Rows in the table */
    rows?: RowOptions[];
}

declare class TableInitOptions {
    /** **WebView** or **WebViewBridge** component to show after rendering given table options */
    webView: WebView | WebViewBridge;

    /** Options of table */
    tableOptions: TableOptions;
}

/**
 * It's creating a table in **WebView** or **WebViewBridge** using given values and style parameters
 * @public
 * @class
 * @param {object} options options - Base options object
 * @param {WebView | WebViewBridge} webView The browser for creating a table
 * @param {TableOptions} tableOptions The options for creating a table
 * @example
 * const headerColumns = ['First name', 'Last name'];
 * const bodyColumns = [
 *     { first: 'Shmi', last: 'Skywalker' },
 *     { first: 'Anakin', last: 'Skywalker' },
 *     { first: 'Luke', last: 'Skywalker' },
 *     { first: 'Leia', last: 'Organa' },
 *     { first: 'Han', last: 'Solo' }
 * ];
 * 
 * const table = new Table({
 *     webView: this.webView1,
 *     tableOptions: {
 *         rows: [
 *             {
 *                 rowStyles: {
 *                     color: '#fff',
 *                     fontWeight: 'bold',
 *                     backgroundColor: '#000'
 *                 },
 *                 columns: headerColumns.map(key => ({ key }))
 *             },
 *             ...bodyColumns.map(column => ({
 *                 rowStyles: {
 *                     padding: '10px 0',
 *                     borderBottom: '1px solid #000'
 *                 },
 *                 columns: [
 *                     { key: column.first },
 *                     { key: column.last }
 *                 ]
 *             }))
 *         ]
 *     }
 * });
 * table.render();
 */
export default class Table extends TableInitOptions {

    /** Web equivalent of CSS properties */
    styleTypes: StyleTypesEnum;

    /**
     * It's creating a table in **WebView** or **WebViewBridge** using given values and style parameters
     * @public
     * @class
     * @param {object} options options - Base options object
     * @param {WebView | WebViewBridge} webView The browser for create a table
     * @param {TableOptions} tableOptions The options for create a table
     * @example
     * const headerColumns = ['First name', 'Last name'];
     * const bodyColumns = [
     *     { first: 'Shmi', last: 'Skywalker' },
     *     { first: 'Anakin', last: 'Skywalker' },
     *     { first: 'Luke', last: 'Skywalker' },
     *     { first: 'Leia', last: 'Organa' },
     *     { first: 'Han', last: 'Solo' }
     * ];
     * 
     * const table = new Table({
     *     webView: this.webView1,
     *     tableOptions: {
     *         rows: [
     *             {
     *                 rowStyles: {
     *                     color: '#fff',
     *                     fontWeight: 'bold',
     *                     backgroundColor: '#000'
     *                 },
     *                 columns: headerColumns.map(key => ({ key }))
     *             },
     *             ...bodyColumns.map(column => ({
     *                 rowStyles: {
     *                     padding: '10px 0',
     *                     borderBottom: '1px solid #000'
     *                 },
     *                 columns: [
     *                     { key: column.first },
     *                     { key: column.last }
     *                 ]
     *             }))
     *         ]
     *     }
     * });
     * table.render();
     */
    constructor(options: TableInitOptions);

    /**
     * It renders the table chart options to the WebView or WebViewBridge browser
     * @method
     * @public
     */
    render(): void;
}