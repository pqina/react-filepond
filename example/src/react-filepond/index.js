/*!
 * react-filepond v7.1.2
 * A handy FilePond adapter component for React
 * 
 * Copyright (c) 2022 PQINA
 * https://pqina.nl/filepond
 * 
 * Licensed under the MIT license.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilePond = exports.FileStatus = exports.registerPlugin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _filepond = require("filepond");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Import required methods and styles from the FilePond module, should not need anything else


// We need to be able to call the registerPlugin method directly so we can add plugins
exports.registerPlugin = _filepond.registerPlugin;
exports.FileStatus = _filepond.FileStatus;

// Do this once

var isSupported = (0, _filepond.supported)();

// filtered methods
var filteredMethods = ["setOptions", "on", "off", "onOnce", "appendTo", "insertAfter", "insertBefore", "isAttachedTo", "replaceElement", "restoreElement", "destroy"];

// The React <FilePond/> wrapper

var FilePond = exports.FilePond = function (_React$Component) {
  _inherits(FilePond, _React$Component);

  function FilePond(props) {
    _classCallCheck(this, FilePond);

    var _this = _possibleConstructorReturn(this, (FilePond.__proto__ || Object.getPrototypeOf(FilePond)).call(this, props));

    _this.allowFilesSync = true;
    return _this;
  }

  // Will setup FilePond instance when mounted


  _createClass(FilePond, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // clone the input so we can restore it in unmount
      this._input = this._element.querySelector('input[type="file"]');
      this._inputClone = this._input.cloneNode();

      // exit here if not supported
      if (!isSupported) return;

      var options = Object.assign({}, this.props);

      // if onupdate files is defined, make sure setFiles does not cause race condition
      if (options.onupdatefiles) {
        var cb = options.onupdatefiles;
        options.onupdatefiles = function (items) {
          _this2.allowFilesSync = false;
          cb(items);
        };
      }

      // Create our pond
      this._pond = (0, _filepond.create)(this._input, options);

      // Reference pond methods to FilePond component instance
      Object.keys(this._pond).filter(function (key) {
        return !filteredMethods.includes(key);
      }).forEach(function (key) {
        _this2[key] = _this2._pond[key];
      });
    }

    // Will clean up FilePond instance when unmounted

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // exit when no pond defined
      if (!this._pond) return;

      // This fixed <Strict> errors

      // FilePond destroy is async so we have to move FilePond to a bin element so it can no longer affect current element tree as React unmount / mount is sync
      var bin = document.createElement("div");
      bin.append(this._pond.element);
      bin.id = "foo";

      // now we call destroy so FilePond can start it's destroy logic
      this._pond.destroy();
      this._pond = undefined;

      // we re-add the original file input element so everything is as it was before
      this._element.append(this._inputClone);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      if (!this.allowFilesSync) {
        this.allowFilesSync = true;
        return false;
      }
      return true;
    }

    // Something changed

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // exit when no pond defined
      if (!this._pond) return;

      var options = Object.assign({}, this.props);

      // this is only set onces, on didmount
      delete options.onupdatefiles;

      // update pond options based on new props
      this._pond.setOptions(options);
    }

    // Renders basic element hook for FilePond to attach to

  }, {
    key: "render",
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

      return (0, _react.createElement)("div", {
        className: "filepond--wrapper",
        ref: function ref(element) {
          return _this3._element = element;
        }
      }, (0, _react.createElement)("input", {
        type: "file",
        name: name,
        id: id,
        accept: acceptedFileTypes,
        multiple: allowMultiple,
        required: required,
        className: className,
        capture: captureMethod
      }));
    }
  }]);

  return FilePond;
}(_react2.default.Component);


