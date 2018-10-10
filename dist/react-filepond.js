/*!
 * react-filepond v5.0.0
 * A handy FilePond adapter component for React
 * 
 * Copyright (c) 2018 PQINA
 * https://pqina.nl/filepond
 * 
 * Licensed under the MIT license.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.File = exports.FilePond = exports.registerPlugin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _filepond = require('filepond');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Import required methods and styles from the FilePond module, should not need anything else


// We need to be able to call the registerPlugin method directly so we can add plugins
exports.registerPlugin = _filepond.registerPlugin;

// Do this once

var isSupported = (0, _filepond.supported)();

// returns file sources from the <File/> child objects
var getFilesFromChildren = function getFilesFromChildren(children) {
  return children ? _react2.default.Children.map(children, function (child) {

    var props = child.props;

    // new mapping
    if (props.src) {
      var options = {};
      if (props.origin) {
        options.type = props.origin;
      }
      if (props.name) {
        options.file = {
          name: props.name,
          size: props.size,
          type: props.type
        };
      }
      if (props.metadata) {
        options.metadata = props.metadata;
      }
      return {
        source: props.src,
        options: options
      };
    }

    // deprecated mapping
    if (props.source && props.type) {
      return {
        source: props.source,
        options: {
          type: props.type
        }
      };
    }

    return props.source;
  }) : [];
};

// filtered methods
var filteredMethods = ['setOptions', 'on', 'off', 'onOnce', 'appendTo', 'insertAfter', 'insertBefore', 'isAttachedTo', 'replaceElement', 'restoreElement', 'destroy'];

// The React <FilePond/> wrapper

var FilePond = exports.FilePond = function (_React$Component) {
  _inherits(FilePond, _React$Component);

  function FilePond() {
    _classCallCheck(this, FilePond);

    return _possibleConstructorReturn(this, (FilePond.__proto__ || Object.getPrototypeOf(FilePond)).apply(this, arguments));
  }

  _createClass(FilePond, [{
    key: 'componentDidMount',

    // Will setup FilePond instance when mounted
    value: function componentDidMount() {
      var _this2 = this;

      // exit here if not supported
      if (!isSupported) {
        return;
      }

      // Create our pond
      this._pond = (0, _filepond.create)(this._element, Object.assign({}, this.props, { files: getFilesFromChildren(this.props.children) }));

      // Reference pond methods to FilePond component instance
      Object.keys(this._pond).filter(function (key) {
        return !filteredMethods.includes(key);
      }).forEach(function (key) {
        _this2[key] = _this2._pond[key];
      });
    }

    // Will clean up FilePond instance when unmounted

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // exit when no pond defined
      if (!this._pond) {
        return;
      }

      this._pond.destroy();
    }

    // Something changed

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      // exit when no pond defined
      if (!this._pond) {
        return;
      }

      var options = Object.assign({}, this.props);

      // test if file list has changed
      var previousFiles = getFilesFromChildren(prevProps.children);
      var currentFiles = getFilesFromChildren(this.props.children);
      if (JSON.stringify(previousFiles) !== JSON.stringify(currentFiles)) {
        options.files = currentFiles;
      }

      this._pond.setOptions(options);
    }

    // Renders basic element hook for FilePond to attach to

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          id = _props.id,
          name = _props.name,
          className = _props.className,
          allowMultiple = _props.allowMultiple,
          required = _props.required,
          captureMethod = _props.captureMethod,
          acceptedFileTypes = _props.acceptedFileTypes;

      return (0, _react.createElement)('div', { className: 'filepond--wrapper' }, (0, _react.createElement)('input', {
        type: 'file',
        name: name,
        id: id,
        accept: acceptedFileTypes,
        multiple: allowMultiple,
        required: required,
        className: className,
        capture: captureMethod,
        ref: function ref(element) {
          return _this3._element = element;
        }
      }));
    }
  }]);

  return FilePond;
}(_react2.default.Component);

// <File/>, needs to be further extended with prop types


var File = exports.File = function (_React$Component2) {
  _inherits(File, _React$Component2);

  function File() {
    _classCallCheck(this, File);

    return _possibleConstructorReturn(this, (File.__proto__ || Object.getPrototypeOf(File)).apply(this, arguments));
  }

  return File;
}(_react2.default.Component);


