<a name="module_router"></a>

## router : <code>object</code>
Adds default goBack action on pages
Sets android onBackButtonPressed
If a pageInstance has shouldExit, exits the application
Handles router.goBack and router.dismiss automatically
Custome behaviour can be overwritten by setting pageInstance.goBack

**Author**: Alper Ozisik <alper.ozisik@smartface.io>  
**Author**: Berk Baski <berk.baski@smartface.io>  
**Copyright**: Smartface 2021  
**Example**  
```js
import Page1Design from 'generated/pages/page1';
export default class Page1 extends Page1Design {
// You should add this function by manual
    goBack: () => void;
    constructor() {
        super();
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        this.button1.onPress = () => {
            this.goBack();
        };
    }
}
function onShow(superOnShow: () => void) {
    superOnShow();
}

function onLoad(superOnLoad: () => void) {
    superOnLoad();
}
```
