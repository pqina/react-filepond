/*!
 * react-filepond v7.1.2
 * A handy FilePond adapter component for React
 * 
 * Copyright (c) 2022 PQINA
 * https://pqina.nl/filepond
 * 
 * Licensed under the MIT license.
 */

import React, { createElement, useCallback } from "react";

// Import required methods and styles from the FilePond module, should not need anything else
import { create, supported, registerPlugin, FileStatus } from "filepond";

// We need to be able to call the registerPlugin method directly so we can add plugins
export { registerPlugin, FileStatus };

// Do this once
const isSupported = supported();

// filtered methods
const filteredMethods = [
  "setOptions",
  "on",
  "off",
  "onOnce",
  "appendTo",
  "insertAfter",
  "insertBefore",
  "isAttachedTo",
  "replaceElement",
  "restoreElement",
  "destroy",
];

// The React <FilePond/> wrapper
export class FilePond extends React.Component {
  constructor(props) {
    super(props);
    this.allowFilesSync = true;
  }

  // Will setup FilePond instance when mounted
  componentDidMount() {
    // clone the input so we can restore it in unmount
    this._input = this._element.querySelector('input[type="file"]');
    this._inputClone = this._input.cloneNode();

    // exit here if not supported
    if (!isSupported) return;

    const options = Object.assign({}, this.props);

    // if onupdate files is defined, make sure setFiles does not cause race condition
    if (options.onupdatefiles) {
      const cb = options.onupdatefiles;
      options.onupdatefiles = (items) => {
        this.allowFilesSync = false;
        cb(items);
      };
    }

    // Create our pond
    this._pond = create(this._input, options);

    // Reference pond methods to FilePond component instance
    Object.keys(this._pond)
      .filter((key) => !filteredMethods.includes(key))
      .forEach((key) => {
        this[key] = this._pond[key];
      });
  }

  // Will clean up FilePond instance when unmounted
  componentWillUnmount() {
    // exit when no pond defined
    if (!this._pond) return;

    // This fixed <Strict> errors

    // FilePond destroy is async so we have to move FilePond to a bin element so it can no longer affect current element tree as React unmount / mount is sync
    const bin = document.createElement("div");
    bin.append(this._pond.element);
    bin.id = "foo";

    // now we call destroy so FilePond can start it's destroy logic
    this._pond.destroy();
    this._pond = undefined;

    // we re-add the original file input element so everything is as it was before
    this._element.append(this._inputClone);
  }

  shouldComponentUpdate() {
    if (!this.allowFilesSync) {
      this.allowFilesSync = true;
      return false;
    }
    return true;
  }

  // Something changed
  componentDidUpdate() {
    // exit when no pond defined
    if (!this._pond) return;

    const options = Object.assign({}, this.props);

    // this is only set onces, on didmount
    delete options.onupdatefiles;

    // update pond options based on new props
    this._pond.setOptions(options);
  }

  // Renders basic element hook for FilePond to attach to
  render() {
    const {
      id,
      name,
      className,
      allowMultiple,
      required,
      captureMethod,
      acceptedFileTypes,
    } = this.props;
    return createElement(
      "div",
      {
        className: "filepond--wrapper",
        ref: (element) => (this._element = element),
      },
      createElement("input", {
        type: "file",
        name,
        id,
        accept: acceptedFileTypes,
        multiple: allowMultiple,
        required: required,
        className: className,
        capture: captureMethod,
      })
    );
  }
}

