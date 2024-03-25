/*!
 * react-filepond v7.1.2
 * A handy FilePond adapter component for React
 * 
 * Copyright (c) 2022 PQINA
 * https://pqina.nl/filepond
 * 
 * Licensed under the MIT license.
 */

import React, { useRef, useEffect, useState } from 'react';
import { create, supported, FileStatus, registerPlugin } from 'filepond';

// Import any necessary styles for FilePond here

// Register any plugins if needed
registerPlugin(/* your plugins here */);

const FilePond = (props) => {
  const [allowFilesSync, setAllowFilesSync] = useState(true);
  const pondRef = useRef(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleFileChange = (event) => {
    if (props.onupdatefiles) {
      setAllowFilesSync(false);
      props.onupdatefiles(event.target.files);
    }
  };

  const initializeFilePond = () => {
    if (!supported()) return;

    const input = inputRef.current;
    const inputClone = input.cloneNode();
    inputClone.addEventListener('change', handleFileChange);

    input.remove();
    wrapperRef.current.appendChild(inputClone);

    const options = { ...props };
    delete options.onupdatefiles;

    const pond = create(inputClone, options);

    Object.keys(pond)
        .filter((key) => !filteredMethods.includes(key))
        .forEach((key) => {
          pondRef.current[key] = pond[key];
        });

    return () => {
      pond.destroy();
      wrapperRef.current.appendChild(input);
    };
  };

  useEffect(initializeFilePond, [props]);

  useEffect(() => {
    if (pondRef.current && props) {
      const options = { ...props };
      delete options.onupdatefiles;
      pondRef.current.setOptions(options);
    }
  }, [props]);

  return (
      <div className="filepond--wrapper" ref={wrapperRef}>
        <input
            type="file"
            name={props.name}
            id={props.id}
            accept={props.acceptedFileTypes}
            multiple={props.allowMultiple}
            required={props.required}
            className={props.className}
            capture={props.captureMethod}
            ref={inputRef}
        />
      </div>
  );
};

export { FilePond, FileStatus, registerPlugin };
