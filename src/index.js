import React, { Component } from "react";

const defaultErrorHandler = ({ name, error: { message } }) =>
  `Failed to fetch dynamic module: ${name}.\nError: ${message}.`;

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
 * @param {Function} options.loader - function which takes module name and returns promise
 * @param {Boolean} [options.isHOC=false] - Is the module a HOC?
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
  placeholder: DefaultPlaceholder = defaultPlaceholder,
  errorHandler: ErrorHandler = defaultErrorHandler
}) => {
  if (!loader || (loader && typeof loader !== "function")) {
    throw new Error("'loader' is required and should be of type 'function'.");
  }

  class DynamicImport extends Component {
    static displayName = `DynamicImport${isHOC ? ":HOC" : ""}(${name || "?"})`;

    isMounted = false;

    state = {
      DynamicComponent: null,
      fetchError: null
    };

    componentDidMount() {
      this.isMounted = true;
      const loaderPromise = loader(name);

      if (
        !loaderPromise ||
        (loaderPromise && !(loaderPromise instanceof Promise))
      ) {
        throw new Error(
          `Expected 'loader' to return a 'Promise', it returned '${typeof loaderPromise}' instead.`
        );
      }

      loader(name)
        .then(mod => {
          const { hocArgs } = this.props;
          const m = mod.default || mod;

          if (this.isMounted) {
            this.setState({
              DynamicComponent: isHOC ? m(...hocArgs) : m
            });
          }
        })
        .catch(fetchError => {
          this.setState({ fetchError });
        });
    }

    componentWillUnmount() {
      this.isMounted = false;
    }

    render() {
      const { DynamicComponent, fetchError } = this.state;
      const { hocArgs, ...props } = this.props;

      if (fetchError) {
        return <ErrorHandler error={fetchError} name={name} />;
      }

      return DynamicComponent ? (
        <DynamicComponent {...props} />
      ) : (
        <DefaultPlaceholder name={name} />
      );
    }
  }

  return isHOC
    ? (...args) =>
        function DynamicImportHOCFetcher(props) {
          return <DynamicImport {...props} hocArgs={args} />;
        }
    : DynamicImport;
};

export default DynamicImportWrapper;
