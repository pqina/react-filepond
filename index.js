/*
 * React FilePond 1.2.0
 * Licensed under MIT, https://opensource.org/licenses/MIT
 * Please visit https://pqina.nl/filepond for details.
 */
import React, { createElement } from 'react';

// Import required methods and styles from the FilePond module, should not need anything else
import { create, supported, registerPlugin } from 'filepond';
import 'filepond/dist/filepond.min.css';

// We need to be able to call the registerPlugin method directly so we can add plugins
export { registerPlugin };

// Do this once
const isSupported = supported();

// returns file sources from the <File/> child objects
const getFilesFromChildren = children =>
  React.Children.map(
    children,
    child => {
      if (child.props.type) {
        return {
          source: child.props.source,
          options: {
            type: child.props.type
          }
        }
      }
      else {
        return child.props.source;
      }
    }
  );

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

    // Get files from children (either as array of objects or sources)
    const files = getFilesFromChildren(this.props.children);

    // Create our pond
    this._pond = create(this._element, Object.assign({}, this.props, files));
    
    this._pond.setOptions({
      files,
    });

    // Reference pond methods to FilePond component instance
    Object.keys(this._pond)
      .filter(key => !filteredMethods.includes(key))
      .forEach((key, index) => {
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