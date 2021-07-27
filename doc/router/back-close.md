<a name="module_router"></a>

## router : <code>object</code>
Back & close headerbar handling for router

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Author**: Ozcan Ovunc <ozcan.ovunc@smartface.io>  
**Copyright**: Smartface 2019  

* [router](#module_router) : <code>object</code>
    * _static_
        * [.dissmissBuilder](#module_router.dissmissBuilder)
    * _inner_
        * [~setDefaultBackStyle(options)](#module_router..setDefaultBackStyle)

<a name="module_router.dissmissBuilder"></a>

### router.dissmissBuilder
**Kind**: static property of [<code>router</code>](#module_router)  
**Access**: public  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dissmissBuilder | <code>function</code> | callback event function used to customise the default dissmiss behaviour for a modal & stack router. That build method takes match, routeData, router, pageInstance, pageProps, route. Arguments are used to shape the returning configuration object with image or text and position. Image and text should be used exclusively. Position is a string enumeration "left" or "right". This configurator is used to shape the HeaderbarItem. The returned object might have retrieveItem method; in that case retrieveItem is called after the headerbarItem is created and given as an argument. If this is not set, default configuration will be used: left side text = done |

**Example**  
```js
import backClose from "@smartface/extension-utils/lib/router/back-close";
backClose.dissmissBuilder = (match, routeData, router, pageInstance, pageProps, route) => {
 if(System.OS === "iOS") {
  if(match.url !== "specificPage")
     return {text: global.lang.done, position: "right"};
  else
     return {image: closeImage, position: "left"};
 }
 else return {image: closeImage, position: "left", color: Color.WHITE};
};
```
<a name="module_router..setDefaultBackStyle"></a>

### router~setDefaultBackStyle(options)
Changes the defult back icon of the StackRouter. This is replacing the constructor of the StackRouter. It should be called before creating any Router to be effective. Calling it after creation of the router has no effect.

**Kind**: inner method of [<code>router</code>](#module_router)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | configuration object for setDefaultBackStyle |
| [options.image] | <code>UI.Image</code> |  | Replaces back icon both iOS & Android |
| [options.hideTitle] | <code>boolean</code> | <code>false</code> | iOS Specific feature. Shows the title of the previous page or not beside the back icon |

**Example**  
```js
import backClose from "@smartface/extension-utils/lib/router/back-close";
backClose.setDefaultBackStyle({image: backArrowImage, hideTitle: true});
```
