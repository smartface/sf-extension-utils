# Utility Extension from Smartface

[![NPM](https://img.shields.io/npm/v/@smartface/extension-utils?style=flat-square)](https://www.npmjs.com/package/@smartface/extension-utils)
[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/smartface/sf-extension-utils/master/LICENSE)

An extension that various utility modules for Smartface Native Framework. You can check the documentation here: https://smartface.github.io/sf-extension-utils/

## Installation

You add add utils via following command:

```shell
yarn add @smartface/extension-utils
```

## How to use

Smartface Utility Extension behaves like a normal npm package. You require/import the packages and you can use your Smartface Application on stereoids!

Later in any file, import it with the path: `import "@smartface/extension-utils/lib/<moduleName>"` Such as:

- `import "@smartface/extension-utils/lib/color"`
- `import "@smartface/extension-utils/lib/pdf"`

### Import their default or normal exports

Some modules will only have one export, so they will be having default export. Before using any module, read their documentation for more information.
Example of default import:

- `import Table from "@smartface/extension-utils/lib/table"`

However, some others will have different export types. You can import them like:

- `import { createAttributedTexts, createAttributedStrings } from "@smartface/extension-utils/lib/html-to-text"`

### API

For each module api documentation is in separate file. Please visit [Utility API Documentation](https://smartface.github.io/sf-extension-utils/).

## Release

Steps to do before release:

- Make sure that the version is appropiate to semver guidelines. Use e.g. `yarn version --minor` to change version.

To publish a new release, create a pull request or push directly to the master with new version. The script will publish it automatically.

## Need Help?

Please [submit an issue](https://github.com/smartface/sf-extension-utils/issues) on GitHub and provide information about your problem.

## Support & Documentation & Useful Links

- [Guides](https://docs.smartface.io/)
- [API Docs](http://ref.smartface.io/)

## Code of Conduct

We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](./LICENSE) file. Within the scope of this license, all modifications to the source code, regardless of the fact that it is used commercially or not, shall be committed as a contribution back to this repository.
