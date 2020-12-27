# react-dynamic-import

⚠️ You might not need this library. Checkout [`React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy) and see if it fits your use case.

Dynamically load and render any react module(Component or an HOC) using dynamic import 🎉

Tiny(**around 1.16kb gzip**) dynamic module loader and renderer.

👉 [DEMO](https://codesandbox.io/s/react-dynamic-import-hooks-demo-108-kuf3u)

> ⚠️ Hooks only(requires react 16.8.0 or above), use [v1.0.4](https://www.npmjs.com/package/react-dynamic-import/v/1.0.4) if you want older react versions support
>
> Dynamic loading of component is already supported in React using React.lazy and Suspense, But, dynamic loading of HOC is tricky and is unsupported in React.
>
> Should work with any bundler(eg: webpack, parcel etc) which supports dynamic import ✨

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ganapativs/react-dynamic-import/)
[![Build Status](https://travis-ci.com/ganapativs/react-dynamic-import.svg?branch=master)](https://travis-ci.com/ganapativs/react-dynamic-import)
[![npm version](https://badge.fury.io/js/react-dynamic-import.svg)](https://badge.fury.io/js/react-dynamic-import)
[![GitHub version](https://badge.fury.io/gh/ganapativs%2Freact-dynamic-import.svg)](https://badge.fury.io/gh/ganapativs%2Freact-dynamic-import) [![Greenkeeper badge](https://badges.greenkeeper.io/ganapativs/react-dynamic-import.svg)](https://greenkeeper.io/)

## Table of Contents

- [Install](#install)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Install

### NPM

```sh
npm install react-dynamic-import
```

### Yarn

```sh
yarn add react-dynamic-import
```

### UMD build

```html
<script src="https://unpkg.com/react-dynamic-import/dist/react-dynamic-import.umd.js"></script>
```

## Basic usage

1. Component

   - **Folder structure**

     ```text
     |_ realComponent.js
     |_ container.js <-- working file
     ```

   - **Usage**

     ```js
     // Import library
     import ReactDynamicImport from "react-dynamic-import";
     // or const ReactDynamicImport = require('react-dynamic-import');

     // Define dynamic import loader function
     const loader = () => import(`./realComponent.js`);

     /**
      * Use dynamic module and lazy fetch component
      *
      * Make sure to use it outside render method,
      * else new component is rendered in each render
      *
      * You can choose to show a placeholder and render
      * error component in case of error, check API section for more
      */
     const RealComponent = ReactDynamicImport({ loader });

     class Container extends React.component {
       render() {
         /**
          * This component is dynamically fetched and rendered
          * on first usage/render
          */
         return <RealComponent />;
       }
     }
     ```

1. HOC

   - **Folder structure**

     ```text
     |_ realComponent.js <-- Real component to wrap in HOC
     |_ withHOC.js <-- HOC
     |_ container.js <-- working file
     ```

   - **Usage**

     ```js
     // Import library
     import ReactDynamicImport from "react-dynamic-import";
     // or const ReactDynamicImport = require('react-dynamic-import');
     import RealComponent from "./realComponent.js";

     // Define dynamic import loader function
     const loader = () => import(`./withHOC.js`);

     /**
      * Use dynamic module and lazy fetch HOC
      *
      * Make sure to use it outside render method,
      * else new component is rendered in each render
      *
      * You can choose to show a placeholder and render error
      * component in case of error, check API section for more
      */
     const DynamicHOC = ReactDynamicImport({ loader, isHOC: true });
     const WrappedComponent = DynamicHOC(RealComponent);

     class Container extends React.component {
       render() {
         /**
          * The actual HOC is lazy loaded and executed,
          * which in turn renders the actual component lazily
          */
         return <WrappedComponent />;
       }
     }
     ```

## Advanced usage

1. Component

   - **Folder structure**

     ```text
     |_ dynamic
     |  |_ realComponent-en.js
     |  |_ realComponent-eu.js
     |  |_ realComponent-kn.js
     |_ container.js <-- working file
     ```

   - **Usage**

     ```js
     // Import library
     import ReactDynamicImport from "react-dynamic-import";
     // or const ReactDynamicImport = require('react-dynamic-import');

     /**
      * Define dynamic import loader function
      *
      * This loads specific module from many available
      * modules in the directory, using given module name
      */
     const loader = f => import(`./dynamic/${f}.js`);

     // Use dynamic module and lazy fetch component
     class Container extends React.component {
       constructor(props) {
         super(props);

         /**
          * Make sure to use it outside render method, else
          * new component is rendered in each render
          *
          * You can choose to show a placeholder and render error
          * component in case of error, check API section for more
          *
          * This loads different module when different language
          * configuration is passed
          */
         this.RealComponent = ReactDynamicImport({
           name: `realComponent-${props.lang || "en"}`,
           loader
         });
       }

       render() {
         const { RealComponent } = this;

         /**
          * This component is dynamically fetched and rendered
          * on first usage/render
          */
         return <RealComponent />;
       }
     }
     ```

1. HOC

   - **Folder structure**

     ```text
     |_ dynamic <-- Dynamic HOC's
     |  |_ withHOC-en.js
     |  |_ withHOC-eu.js
     |  |_ withHOC-kn.js
     |_ realComponent.js <-- Real component to wrap in HOC
     |_ container.js <-- working file
     ```

   - **Usage**

     ```js
     // Import library
     import ReactDynamicImport from "react-dynamic-import";
     // or const ReactDynamicImport = require('react-dynamic-import');
     import RealComponent from "./realComponent.js";

     /**
      * Define dynamic import loader function
      *
      * This loads specific module from many available
      * modules in the directory, using given module name
      */
     const loader = f => import(`./dynamic/${f}.js`);

     // Use dynamic module and lazy fetch component
     class Container extends React.component {
       constructor(props) {
         super(props);

         /**
          * Make sure to use it outside render method, else
          * new component is rendered in each render
          *
          * You can choose to show a placeholder and render error
          * component in case of error, check API section for more
          *
          * This loads different module when different language
          * configuration is passed
          */
         const DynamicHOC = ReactDynamicImport({
           name: `withHOC-${props.lang || "en"}`,
           loader,
           isHOC: true
         });
         this.WrappedComponent = DynamicHOC(RealComponent);
       }

       render() {
         const { WrappedComponent } = this;

         /**
          * The actual HOC is lazy loaded and executed,
          * which in turn renders the actual component lazily
          */
         return <WrappedComponent />;
       }
     }
     ```

Checkout [API](#api) for more info.

## API

- [React Dynamic Import](docs/react-dynamic-import.md)

## Contribute

Thanks for taking time to contribute, please read [docs](docs) and checkout [src](src) to understand how things work.

### Reporting Issues

Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](../../issues).
If don't, just open a [new clear and descriptive issue](../../issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.

- Fork it!
- Clone your fork: `git clone https://github.com/<your-username>/react-dynamic-import`
- Navigate to the newly cloned directory: `cd react-dynamic-import`
- Create a new branch for the new feature: `git checkout -b my-new-feature`
- Install the tools necessary for development: `yarn`
- Make your changes.
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request with full remarks documenting your changes

### TODO

- [ ] Test cases

## License

[MIT License](https://opensource.org/licenses/MIT) © [Ganapati V S](https://meetguns.com)
