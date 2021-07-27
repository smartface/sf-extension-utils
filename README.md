# Utility Extension from Smartface
[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/smartface/sf-extension-utils/master/LICENSE)

An extension that has following utility classes for Smartface Native Framework. You can check the documentation of each module under [doc directory](https://github.com/smartface/sf-extension-utils/tree/master/doc)
- RAU (easy use for Remote App Update)
- Apple Device Namings (e.g converts iPhone12,5 to human readable iPhone 11 Pro Max)
- Biometrics (easy & best practice use for Fingerprint or Face ID)
- Alert (fixes global alert)
- SpeechToText (setups timers for speech recognition)
- Permission (gets permissions with ease using a simple callback)
- Location (gets location with callback, no need to worry for the permission code)
- Nagivation (Draws a navigation route through your favorite applications like Google Maps, Yandex Navi, Apple Maps)
- Nagivation (Drops a pin through your favorite applications like Google Maps, Yandex Maps, Apple Maps)
- Timers (fixes thread issue of setTimeout & setInterval)
- Orientation (solves problems of managing different behaviour of Oritentation of iOS & Android)
- ServiceCall (service call library for common JSON requests)
- ServiceCallOffline (service call library with offline capability)
- ButtonActivity (setting an activity indicator with correct elevation on top of a button)
- WebViewBridge (bi directional webview communication)
- Touch (addPress event to any target object)
- Color (converts Smartface color to TinyColor for color manipulations)
- TextBox (max text length)
- Html to Text (Converts html to natively supported AttributedString)
- Copy (creates a shallow copy of an object)
- Router (with buildExtender page management made easy and with back-close navigations made easy)
- Guid (creates uuid-v4 text)
- getCombinedStyle (gets style object from theme class)
- RTLTabBarController (supports Right-To-Left direction and vice versa)
- RTLSwipeView (supports Right-To-Left direction and vice versa)
- PDF (renders base64 string as pdf file in a WebView)
- RootDetection (detects if the device is rooted or not)
- Art (Smartface module that allows you to draw vector graphics)

## Installation
By default, Utility Extension is installed on any Smartface Project. If not installed or accidentally deleted, you can install it via on your script folder:
```shell
npm i @smartface/extension-utils
```
## How to use
Smartface Utility Extension behaves like a normal npm package. You require/import the packages and you can use your Smartface Application on stereoids!
### 1. Fix global methods
In `app.ts` make sure that `import "sf-extension-utils"` is set. This is fixing `alert`, `setTimeout`, `setInterval`, `clearTimeout` and `clearInterval` methods. Some of the other util modules might depend on it!
### 2. Import util modules
Later in any file, import it with the path: `import "sf-extension-utils/lib/<moduleName>"` Such as:
- `import "sf-extension-utils/lib/rau"`
- `import "sf-extension-utils/lib/permission"`
- `import "sf-extension-utils/lib/biometricLogin"`
- `import "sf-extension-utils/lib/speechtotext"`
- `import "sf-extension-utils/lib/location"`

### 3. Import their default or normal exports
Some modules will only have one export, so they will be having default export. Before using any module, read their documentation for more information.
Example of default import:
- `import BiometricLogin from "sf-extension-utils/lib/biometricLogin"`

However, some others will have different export types. You can import them like:
- `import { createAttributedTexts, createAttributedStrings } from "sf-extension-utils/lib/html-to-text"`

### API
For each module api documentation is in separate file. Please visit [doc](./doc) folder

## Release
Steps to do before release:
- Make sure the docs are up-to-date. Run `npm run docs` to update them.
- Make sure that the version is appropiate to semver guidelines. Use e.g. `npm version minor` to change version. Do not do it manually.
- Make sure your auth is correct.

To publish a new release, use the command
```
npm run publish-utl
```
to publish to the right repository. Otherwise, you will get an error.

## Need Help?

Please [submit an issue](https://github.com/smartface/sf-extension-utils/issues) on GitHub and provide information about your problem.

## Support & Documentation & Useful Links
- [Guides](https://docs.smartface.io/)
- [API Docs](http://ref.smartface.io/)
- [Smartface Cloud Dashboard](https://ide.smartface.io)

## Code of Conduct
We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](./LICENSE) file. Within the scope of this license, all modifications to the source code, regardless of the fact that it is used commercially or not, shall be committed as a contribution back to this repository.
