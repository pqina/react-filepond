/*!
 * react-filepond v5.0.0
 * A handy FilePond adapter component for React
 * 
 * Copyright (c) 2018 PQINA
 * https://pqina.nl/filepond
 * 
 * Licensed under the MIT license.
 */

import React, { createElement } from 'react';

// Import required methods and styles from the FilePond module, should not need anything else
import { create, supported, registerPlugin } from 'filepond';

// We need to be able to call the registerPlugin method directly so we can add plugins
export { registerPlugin };

// Do this once
const isSupported = supported();

// returns file sources from the <File/> child objects
const getFilesFromChildren = children =>
  children ? React.Children.map(
    children,
    child => {
      
      const props = child.props;

      // new mapping
      if (props.src) {
        const options = {};
        if (props.origin) {
          options.type = props.origin;
        }
        if (props.name) {
          options.file = {
            name: props.name,
            size: props.size,
            type: props.type
          }
        }
        if (props.metadata) {
          options.metadata = props.metadata;
        }
        return {
          source: props.src,
          options
        }
      }

      // deprecated mapping
      if (props.source && props.type) {
        return {
          source: props.source,
          options: {
            type: props.type
          }
        }
      }
      
      return props.source;
    }
  ) : [];

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
  // Will setup FilePond instance when mounted
  componentDidMount() {

    // exit here if not supported
    if (!isSupported) {
      return;
    }

    // Create our pond
    this._pond = create(this._element, Object.assign({}, this.props, { files: getFilesFromChildren(this.props.children) }));

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
    if (!this._pond) {
      return;
    }

    this._pond.destroy();
  }

  // Something changed
  componentDidUpdate(prevProps) {
    // exit when no pond defined
    if (!this._pond) {
      return;
    }

    const options = Object.assign({}, this.props);

    // test if file list has changed
    const previousFiles = getFilesFromChildren(prevProps.children);
    const currentFiles = getFilesFromChildren(this.props.children);
    if (JSON.stringify(previousFiles) !== JSON.stringify(currentFiles)) {
      options.files = currentFiles;
    }

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

// <File/>, needs to be further extended with prop types
export class File extends React.Component { }

