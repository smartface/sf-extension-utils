<a name="module_Table"></a>

## Table : <code>object</code>
**Author**: Berk Baski <berk.baski@smartface.io>  
**Copyright**: Smartface 2021  

* [Table](#module_Table) : <code>object</code>
    * [~Table](#module_Table..Table)
        * [new Table(options, webView, tableOptions)](#new_module_Table..Table_new)
        * [.styleTypes](#module_Table..Table+styleTypes)
        * [.render()](#module_Table..Table+render)

<a name="module_Table..Table"></a>

### Table~Table
It's creating a table in **WebView** or **WebViewBridge** using given values and style parameters

**Kind**: inner class of [<code>Table</code>](#module_Table)  
**Access**: public  

* [~Table](#module_Table..Table)
    * [new Table(options, webView, tableOptions)](#new_module_Table..Table_new)
    * [.styleTypes](#module_Table..Table+styleTypes)
    * [.render()](#module_Table..Table+render)

<a name="new_module_Table..Table_new"></a>

#### new Table(options, webView, tableOptions)
It's creating a table in **WebView** or **WebViewBridge** using given values and style parameters


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | options - Base options object |
| webView | <code>WebView</code> \| <code>WebViewBridge</code> | The browser for creating a table |
| tableOptions | <code>TableOptions</code> | The options for creating a table |

**Example**  
```js
const headerColumns = ['First name', 'Last name'];
const bodyColumns = [
    { first: 'Shmi', last: 'Skywalker' },
    { first: 'Anakin', last: 'Skywalker' },
    { first: 'Luke', last: 'Skywalker' },
    { first: 'Leia', last: 'Organa' },
    { first: 'Han', last: 'Solo' }
];

const table = new Table({
    webView: this.webView1,
    tableOptions: {
        rows: [
            {
                rowStyles: {
                    color: '#fff',
                    fontWeight: 'bold',
                    backgroundColor: '#000'
                },
                columns: headerColumns.map(key => ({ key }))
            },
            ...bodyColumns.map(column => ({
                rowStyles: {
                    padding: '10px 0',
                    borderBottom: '1px solid #000'
                },
                columns: [
                    { key: column.first },
                    { key: column.last }
                ]
            }))
        ]
    }
});
table.render();
```
<a name="module_Table..Table+styleTypes"></a>

#### table.styleTypes
Web equivalent of CSS properties

**Kind**: instance property of [<code>Table</code>](#module_Table..Table)  
<a name="module_Table..Table+render"></a>

#### table.render()
It renders the table chart options to the WebView or WebViewBridge browser

**Kind**: instance method of [<code>Table</code>](#module_Table..Table)  
**Access**: public  
