/**
 * @module Table
 * @type {object}
 * @author Berk Baski <berk.baski@smartface.io>
 * @copyright Smartface 2021
 */

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
class Table {
    /** Web equivalent of CSS properties */

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
    constructor(options = {}) {
        this.styleTypes = {
            width: 'width',
            height: 'height',
            margin: 'margin',
            marginLeft: 'margin-left',
            marginRight: 'margin-right',
            marginBottom: 'margin-bottom',
            marginTop: 'margin-top',
            padding: 'padding',
            paddingLeft: 'padding-left',
            paddingRight: 'padding-right',
            paddingBottom: 'padding-bottom',
            paddingTop: 'padding-top',
            color: 'color',
            background: 'background',
            backgroundColor: 'background-color',
            fontSize: 'font-size',
            fontWeight: 'font-weight',
            fontFamily: 'font-family',
            border: 'border',
            borderLeft: 'border-left',
            borderRight: 'border-right',
            borderBottom: 'border-bottom',
            borderTop: 'border-top',
            alignItems: 'align-items',
            justifyContent: 'justify-content',
            diplay: 'display',
            position: 'position',
            left: 'left',
            right: 'right',
            bottom: 'bottom',
            top: 'top',
            zIndex: 'z-index'
        };
        this.webView = options.webView;
        this.tableOptions = options.tableOptions;

        if (!this.webView) {
            throw new Error('webView parameter is required');
        }

        if (!this.tableOptions.styleLinks) {
            this.tableOptions.styleLinks = [];
        }

        if (!this.tableOptions.rows) {
            this.tableOptions.rows = [];
        }
    }

    /**
     * It renders the table chart options to the WebView or WebViewBridge browser
     * @method
     * @public
     */
    render() {
        const html = this.generateHtml();
        if (this.webView.webView) {
            this.webView.webView.loadHTML(html);
        } else {
            this.webView.loadHTML(html);
        }
    }

    generateHtml() {
        const styles = `
        <style>
            ${this.tableOptions.externalStyles}
            .table {
            width: 300px;
            }
            .table-row {
            display: flex;
            }
            .table-column {
            flex: 1;
            min-height: 30px;
            }
            .bold {
            font-weight: bold;
            }
            .border {
            border: 1px solid #000;
            }
            .d-flex {
            display: flex;
            }
            .align-start {
            align-items: flex-start;
            }
            .align-center {
            align-items: center;
            }
            .align-end {
            align-items: flex-end;
            }
            .justify-start {
            justify-content: flex-start;
            }
            .justify-center {
            justify-content: center;
            }
            .justify-end {
            justify-content: flex-end;
            }
        </style>
      `;
        const html = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1">
            ${this.tableOptions.styleLinks.map((link) => link).join('\n')}
        </head>
        <body>
            <table
                ${this.parseClasses(`table ${this.tableOptions.tableClass || ''}`)}
                ${this.parseStyles(this.tableOptions.tableStyles)}
                ${this.parseAttributes(this.tableOptions.tableAttributes)}
            >
            ${this.getTableRows(this.tableOptions.rows)}
            </table>
            ${styles}
        </body>
        </html>`;
        return html;
    }

    parseAttributes(attributes) {
        return Object.keys(attributes || {}).map(key => `${key}="${attributes[key]}"`).join(' ');
    }

    parseClasses(classes) {
        return `class="${classes ? classes : ''}"`
    }

    parseStyles(styles) {
        return `style="${Object.keys(styles || {}).map((key) => `${this.styleTypes[key]}:${styles[key]};`).join('')}"`
    }

    getTableRows(rows) {
        return rows.map((row) =>
            `<tr 
                ${this.parseClasses(row.rowClass)}
                ${this.parseStyles(row.rowStyles)}
                ${this.parseAttributes(row.rowAttributes)}
            >
                ${this.getRowColumns(row.columns)}
            </tr>`).join('')
    }

    getRowColumns(columns) {
        return columns.map((column) =>
            `<td 
                ${this.parseClasses(`table-column ${column.columnClass || ''}`)}
                ${this.parseStyles(column.columnStyles)}
                ${this.parseAttributes(column.columnAttributes)}
            >
                ${column.key}
            </td>`).join('');
    }
}

exports = module.exports = Table;