<a name="DynamicImportWrapper"></a>

## DynamicImportWrapper(options)
Dynamically load any react module(Component or an HOC)

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options passed to react dynamic import functions |
| options.loader | <code>function</code> |  | function which takes module name and returns promise to resolve module |
| [options.isHOC] | <code>Boolean</code> | <code>false</code> | Is the module an HOC? |
| [options.name] | <code>String</code> |  | Dynamic module to be fetched(Mostly it will be part of the module file name),                                        optional if loader returns same component every time |
| [options.placeholder] | <code>Component</code> | <code>defaultPlaceholder</code> | React component to be rendered until actual module is fetched                                                               (You can add UX improvements like adding small delay before showing                                                               loader inside your class/functional component) |
| [options.errorHandler] | <code>Component</code> | <code>defaultErrorHandler</code> | React component to be rendered if fetching actual module fails.                                                                 This will receive `name` and `error` object as `props` |

**Example**  
```js
- Module loader function
     const loader = f => import(`./dynamic/${f}.js`);
 - Use dynamic module(Make sure to use it outside render method, else new component is rendered in each render)
     const RealComponent = DynamicImport({ name: 'realModuleName', loader }),
```
