# Utility Extension from Smartface
[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/smartface/sf-extension-utils/master/LICENSE)

An extension that has following utility classes for Smartface Native Framework.
- RAU (easy use for Remote App Update)
- Fingerprint & Touch ID (easy & best practice use for Fingerprint)
- Alert (fixes global alert)
- SpeechToText (setups timers for speech recognition)
- Permission (gets permissions with ease using a simple callback)
- Location (gets location with callback, no need to worry for the permission code)
- Timers (fixes thread issue of setTimeout & setInterval)
- Orientation (solves problems of managing different behaviour of Oritentation of iOS & Android)
- ServiceCall (service call library for common JSON requests)
- ButtonActivity (setting an activity indicator with correct elevation on top of a button)
- WebViewBridge (bi directional communication)
- Touch (addPress event to any target object)
- Color (converts Smartface color to TinyColor for color manipulations)
- TextBox (max text length)

## Installation
Utility extension can be installed via npm easily from our public npm repository. The installation is pretty easy via Smartface Cloud IDE.
Run the following code in terminal
```shell
(cd ~/workspace/scripts && npm i -S sf-extension-utils)
```
## How to use
Just ```require("sf-extension-utils")``` and .&lt;name&gt; of the module to use.
For timers and alert there is no accessor, there making global modifications.
- ```require("sf-extension-utils").rau```
- ```require("sf-extension-utils").permission```
- ```require("sf-extension-utils").fingerprint```
- ```require("sf-extension-utils").speechToText```
- ```require("sf-extension-utils").location```

### API
For each module api documentation is in separate file. Please visit [doc](./doc) folder

## Need Help?

Please [submit an issue](https://github.com/smartface/sf-extension-utils/issues) on GitHub and provide information about your problem.

## Support & Documentation & Useful Links
- [Guides](https://developer.smartface.io/)
- [API Docs](http://ref.smartface.io/)
- [Smartface Cloud Dashboard](https://cloud.smartface.io)

## Code of Conduct
We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](./LICENSE) file. Within the scope of this license, all modifications to the source code, regardless of the fact that it is used commercially or not, shall be committed as a contribution back to this repository.
