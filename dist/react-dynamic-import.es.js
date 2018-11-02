import React, { Component } from 'react';

function _typeof(obj) {
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
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

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var defaultErrorHandler = function defaultErrorHandler(_ref) {
  var name = _ref.name,
      message = _ref.error.message;
  return "Failed to fetch dynamic module: ".concat(name, ".\nError: ").concat(message, ".");
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


var DynamicImportWrapper = function DynamicImportWrapper(_ref2) {
  var loader = _ref2.loader,
      _ref2$isHOC = _ref2.isHOC,
      isHOC = _ref2$isHOC === void 0 ? false : _ref2$isHOC,
      name = _ref2.name,
      _ref2$placeholder = _ref2.placeholder,
      DefaultPlaceholder = _ref2$placeholder === void 0 ? defaultPlaceholder : _ref2$placeholder,
      _ref2$errorHandler = _ref2.errorHandler,
      ErrorHandler = _ref2$errorHandler === void 0 ? defaultErrorHandler : _ref2$errorHandler;

  if (!loader || loader && typeof loader !== "function") {
    throw new Error("'loader' is required and should be of type 'function'.");
  }

  var DynamicImport =
  /*#__PURE__*/
  function (_Component) {
    _inherits(DynamicImport, _Component);

    function DynamicImport() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, DynamicImport);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DynamicImport)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isMounted", false);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        DynamicComponent: null,
        fetchError: null
      });

      return _this;
    }

    _createClass(DynamicImport, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        this.isMounted = true;
        var loaderPromise = loader(name);

        if (!loaderPromise || loaderPromise && !(loaderPromise instanceof Promise)) {
          throw new Error("Expected 'loader' to return a 'Promise', it returned '".concat(_typeof(loaderPromise), "' instead."));
        }

        loader(name).then(function (mod) {
          var hocArgs = _this2.props.hocArgs;
          var m = mod.default || mod;

          if (_this2.isMounted) {
            _this2.setState({
              DynamicComponent: isHOC ? m.apply(void 0, _toConsumableArray(hocArgs)) : m
            });
          }
        }).catch(function (fetchError) {
          _this2.setState({
            fetchError: fetchError
          });
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.isMounted = false;
      }
    }, {
      key: "render",
      value: function render() {
        var _this$state = this.state,
            DynamicComponent = _this$state.DynamicComponent,
            fetchError = _this$state.fetchError;

        var _this$props = this.props,
            hocArgs = _this$props.hocArgs,
            props = _objectWithoutProperties(_this$props, ["hocArgs"]);

        if (fetchError) {
          return React.createElement(ErrorHandler, {
            error: fetchError,
            name: name
          });
        }

        return DynamicComponent ? React.createElement(DynamicComponent, props) : React.createElement(DefaultPlaceholder, {
          name: name
        });
      }
    }]);

    return DynamicImport;
  }(Component);

  _defineProperty(DynamicImport, "displayName", "DynamicImport".concat(isHOC ? ":HOC" : "", "(").concat(name || "?", ")"));

  return isHOC ? function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return (
      /*#__PURE__*/
      // Using class component here to support ref
      function (_Component2) {
        _inherits(DynamicImportHOCFetcher, _Component2);

        function DynamicImportHOCFetcher() {
          _classCallCheck(this, DynamicImportHOCFetcher);

          return _possibleConstructorReturn(this, _getPrototypeOf(DynamicImportHOCFetcher).apply(this, arguments));
        }

        _createClass(DynamicImportHOCFetcher, [{
          key: "render",
          value: function render() {
            return React.createElement(DynamicImport, _extends({}, this.props, {
              hocArgs: args
            }));
          }
        }]);

        return DynamicImportHOCFetcher;
      }(Component)
    );
  } : DynamicImport;
};

export default DynamicImportWrapper;
//# sourceMappingURL=react-dynamic-import.es.js.map
