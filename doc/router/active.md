<a name="module_router"></a>

## router : <code>object</code>
Active page reference for router

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Copyright**: Smartface 2019  
<a name="module_router.page"></a>

### router.page
Gets or sets the current page instance for the router util. This is managed by the router util. Setting this will not activly change the current page, it is just a reference

**Kind**: static property of [<code>router</code>](#module_router)  
**Properties**

| Name | Type |
| --- | --- |
| page | <code>UI.Page</code> | 

**Example**  
```js
import active from "@smartface/extension-utils/lib/router/active";
const currentPage = active.page;
currentPage.layout.applyLayout();
```
