/* eslint-disable react/prop-types */
import React, { forwardRef, useRef, useState, useEffect } from 'react';

const defaultErrorHandler = ({ name, error: { message } }) =>
  `Unable to fetch module: ${name}.\nError: ${message}.`;

const defaultPlaceholder = () => null;

/**
 * Dynamically load any react module(Component or an HOC)
 *
 * @example
 *  - Module loader function
 *      const loader = f => import(`./dynamic/${f}.js`);
 *  - Use dynamic module(Make sure to use it outside render method, else new component is rendered in each render)
 *      const RealComponent = DynamicImport({ name: 'realModuleName', loader }),
 *
 * @param {Object} options - Options passed to react dynamic import functions
 * @param {Function} options.loader - function which takes module name and returns promise to resolve module
 * @param {Boolean} [options.isHOC=false] - Is the module an HOC?
 * @param {String} [options.name] - Dynamic module to be fetched(Mostly it will be part of the module file name),
 *                                        optional if loader returns same component every time
 * @param {Component} [options.placeholder=defaultPlaceholder] - React component to be rendered until actual module is fetched
 *                                                               (You can add UX improvements like adding small delay before showing
 *                                                               loader inside your class/functional component)
 * @param {Component} [options.errorHandler=defaultErrorHandler] - React component to be rendered if fetching actual module fails.
 *                                                                 This will receive `name` and `error` object as `props`
 */
const DynamicImportWrapper = ({
  loader,
  isHOC = false,
  name,
  placeholder: Placeholder = defaultPlaceholder,
  errorHandler: ErrorHandler = defaultErrorHandler,
}) => {
  if (!loader || (loader && typeof loader !== 'function')) {
    throw new Error("'loader' is required and should be of type 'function'.");
  }

  function DynamicImport(props) {
    const isMounted = useRef(false);
    const [DynamicModule, setDynamicModule] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const { hocArgs, forwardedRef, ...rest } = props;

    useEffect(() => {
      isMounted.current = true;
      const loaderPromise = loader(name);

      if (
        !loaderPromise ||
        (loaderPromise && !(loaderPromise instanceof Promise))
      ) {
        throw new Error(
          `Expected 'loader' to return a 'Promise', but, it returned '${typeof loaderPromise}' instead.`,
        );
      }

      // Async await increases the bundle size
      loaderPromise
        .then(mod => {
          if (isMounted.current) {
            const m = mod.default || mod;

            // useState executes the function if functional component is passed
            setDynamicModule({ component: isHOC ? m(...hocArgs) : m });
          }
        })
        .catch(err => {
          if (isMounted.current) {
            setFetchError(err);
          }
        });

      return () => {
        isMounted.current = false;
      };
    }, [hocArgs]);

    if (fetchError) {
      return <ErrorHandler error={fetchError} name={name} />;
    }

    return DynamicModule ? (
      <DynamicModule.component {...rest} ref={forwardedRef} />
    ) : (
      <Placeholder name={name} />
    );
  }

  DynamicImport.displayName = `DynamicImport${isHOC ? ':HOC' : ''}(${name ||
    'Unknown'})`;

  function DynamicImportFetcher(props, ref) {
    return <DynamicImport {...props} forwardedRef={ref} />;
  }
  DynamicImportFetcher.displayName = 'DynamicImportFetcher';

  const ComponentFetcher = forwardRef(DynamicImportFetcher);

  const HOCFetcher = (...args) => {
    function DynamicImportHOCFetcher(props, ref) {
      return <DynamicImport {...props} forwardedRef={ref} hocArgs={args} />;
    }
    DynamicImportHOCFetcher.displayName = 'DynamicImportHOCFetcher';

    return forwardRef(DynamicImportHOCFetcher);
  };

  return isHOC ? HOCFetcher : ComponentFetcher;
};

export default DynamicImportWrapper;
