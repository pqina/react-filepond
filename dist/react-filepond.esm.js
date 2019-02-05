/*!
 * react-filepond v7.0.1
 * A handy FilePond adapter component for React
 * 
 * Copyright (c) 2019 PQINA
 * https://pqina.nl/filepond
 * 
 * Licensed under the MIT license.
 */

import React, { createElement } from 'react';

// Import required methods and styles from the FilePond module, should not need anything else
import { create, supported, registerPlugin, FileStatus } from 'filepond';

// We need to be able to call the registerPlugin method directly so we can add plugins
export { registerPlugin, FileStatus };

// Do this once
const isSupported = supported();

// filtered methods
const filteredMethods = [
  'setOptions',
  'on',
  'off',
  'onOnce',
  'appendTo',
  'insertAfter',
  'insertBefore',
  'isAttachedTo',
  'replaceElement',
  'restoreElement',
  'destroy'
];

// The React <FilePond/> wrapper
export class FilePond extends React.Component {

  constructor(props) {
    super(props);
    this.allowFilesSync = true;
  }

  // Will setup FilePond instance when mounted
  componentDidMount() {

    // exit here if not supported
    if (!isSupported) return;

    const options = Object.assign({}, this.props);

    // if onupdate files is defined, make sure setFiles does not cause race condition
    if (options.onupdatefiles) {
      const cb = options.onupdatefiles;
      options.onupdatefiles = (items) => {
        this.allowFilesSync = false;
        cb(items);
      }
    }
    
    // Create our pond
    this._pond = create(this._element, options);

    // Reference pond methods to FilePond component instance
    Object.keys(this._pond)
      .filter(key => !filteredMethods.includes(key))
      .forEach(key => {
        this[key] = this._pond[key];
      });
  }

  // Will clean up FilePond instance when unmounted
  componentWillUnmount() {
    // exit when no pond defined
    if (!this._pond) return;
    this._pond.destroy();
    this.allowFilesSync = true;
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
      acceptedFileTypes
    } = this.props;
    return createElement(
      'div',
      { className: 'filepond--wrapper' },
      createElement('input', {
        type: 'file',
        name,
        id,
        accept: acceptedFileTypes,
        multiple: allowMultiple,
        required: required,
        className: className,
        capture: captureMethod,
        ref: element => (this._element = element)
      })
    );
  }
}

