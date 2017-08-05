# Utility Extension from Smartface
[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/smartface/sf-extension-utils/master/LICENSE)

An extension that has following utility classes for Smartface Native Framework.
- RAU (Remote App Update)
- Fingerprint & Touch ID
- Alert
- SpeechToText
- Permission
- Location
- Timers

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
For each module api documentation is in separate file
- [alert](./doc/alert.md)
- [timers](./doc/timers.md)
- [permission](./doc/permission.md)
- [speechToText](./doc/speech_to_text.md)
- [rau](./doc/rau.md)
- [location](./doc/location.md)
- [fingerprint](./doc/fingerprint.md)

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
