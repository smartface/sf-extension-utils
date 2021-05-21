<a name="module_router"></a>

## router : <code>object</code>
Adds default goBack action on pages
Sets android onBackButtonPressed
If a pageInstance has shouldExit, exits the application
Handles router.goBack and router.dismiss automatically
Custome behaviour can be overwritten by setting pageInstance.goBack

**Example**  
```ts
import Page1Design from 'generated/pages/page1';

export default class Page1 extends Page1Design {
    // You should add this function by manual
    goBack: () => void;

    constructor() {
        super();
        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // Overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        this.button1.onPress = () => {
            this.goBack();
        };
    }
}

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow: () => void) {
    superOnShow();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad: () => void) {
    superOnLoad();
}
```

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Author**: Berk Baski <berk.baski@smartface.io>  
**Copyright**: Smartface 2021  
