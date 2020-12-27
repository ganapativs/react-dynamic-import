import { forwardRef, createElement, useRef, useState, useEffect } from 'react';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var defaultErrorHandler = function defaultErrorHandler(_ref) {
  var name = _ref.name,
      message = _ref.error.message;
  return "Unable to fetch module: ".concat(name, ".\nError: ").concat(message, ".");
};

var defaultPlaceholder = function defaultPlaceholder() {
  return null;
};
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


var DynamicImportWrapper = function DynamicImportWrapper(_ref2) {
  var loader = _ref2.loader,
      _ref2$isHOC = _ref2.isHOC,
      isHOC = _ref2$isHOC === void 0 ? false : _ref2$isHOC,
      name = _ref2.name,
      _ref2$placeholder = _ref2.placeholder,
      Placeholder = _ref2$placeholder === void 0 ? defaultPlaceholder : _ref2$placeholder,
      _ref2$errorHandler = _ref2.errorHandler,
      ErrorHandler = _ref2$errorHandler === void 0 ? defaultErrorHandler : _ref2$errorHandler;

  if (!loader || loader && typeof loader !== 'function') {
    throw new Error("'loader' is required and should be of type 'function'.");
  }

  function DynamicImport(props) {
    var isMounted = useRef(false);

    var _React$useState = useState(null),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        DynamicModule = _React$useState2[0],
        setDynamicModule = _React$useState2[1];

    var _React$useState3 = useState(null),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        fetchError = _React$useState4[0],
        setFetchError = _React$useState4[1];

    var hocArgs = props.hocArgs,
        forwardedRef = props.forwardedRef,
        rest = _objectWithoutProperties(props, ["hocArgs", "forwardedRef"]);

    useEffect(function () {
      isMounted.current = true;
      var loaderPromise = loader(name);

      if (!loaderPromise || loaderPromise && !(loaderPromise instanceof Promise)) {
        throw new Error("Expected 'loader' to return a 'Promise', but, it returned '".concat(_typeof(loaderPromise), "' instead."));
      } // Async await increases the bundle size


      loaderPromise.then(function (mod) {
        if (isMounted.current) {
          var m = mod["default"] || mod; // useState executes the function if functional component is passed

          setDynamicModule({
            component: isHOC ? m.apply(void 0, _toConsumableArray(hocArgs)) : m
          });
        }
      })["catch"](function (err) {
        if (isMounted.current) {
          setFetchError(err);
        }
      });
      return function () {
        isMounted.current = false;
      };
    }, [hocArgs]);

    if (fetchError) {
      return /*#__PURE__*/createElement(ErrorHandler, {
        error: fetchError,
        name: name
      });
    }

    return DynamicModule ? /*#__PURE__*/createElement(DynamicModule.component, _extends({}, rest, {
      ref: forwardedRef
    })) : /*#__PURE__*/createElement(Placeholder, {
      name: name
    });
  }

  DynamicImport.displayName = "DynamicImport".concat(isHOC ? ':HOC' : '', "(").concat(name || 'Unknown', ")");

  function DynamicImportFetcher(props, ref) {
    return /*#__PURE__*/createElement(DynamicImport, _extends({}, props, {
      forwardedRef: ref
    }));
  }

  DynamicImportFetcher.displayName = 'DynamicImportFetcher';
  var ComponentFetcher = /*#__PURE__*/forwardRef(DynamicImportFetcher);

  var HOCFetcher = function HOCFetcher() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    function DynamicImportHOCFetcher(props, ref) {
      return /*#__PURE__*/createElement(DynamicImport, _extends({}, props, {
        forwardedRef: ref,
        hocArgs: args
      }));
    }

    DynamicImportHOCFetcher.displayName = 'DynamicImportHOCFetcher';
    return /*#__PURE__*/forwardRef(DynamicImportHOCFetcher);
  };

  return isHOC ? HOCFetcher : ComponentFetcher;
};

export default DynamicImportWrapper;
//# sourceMappingURL=react-dynamic-import.es.js.map
