import React, {useEffect, useRef} from "react";
import {create, supported} from "filepond";

export const FilePond = (props) => {
  const elementRef = useRef(null); // Ref for the wrapper element
  const inputRef = useRef(null); // Ref for the input element
  const pondRef = useRef(null); // Ref for the FilePond instance
  let allowFilesSync = true; // Flag to prevent race condition

  // Check if FilePond is supported
  const isSupported = supported();

  // Clone the input element when component mounts
  useEffect(() => {
    inputRef.current = elementRef.current.querySelector('input[type="file"]');
    inputRef.currentClone = inputRef.current.cloneNode();

    // Exit if FilePond is not supported
    if (!isSupported) return;

    const options = { ...props };

    // If onupdatefiles is defined, prevent race condition
    if (options.onupdatefiles) {
      const cb = options.onupdatefiles;
      options.onupdatefiles = (items) => {
        allowFilesSync = false;
        cb(items);
      };
    }

    // Create FilePond instance
    pondRef.current = create(inputRef.current, options);

    // Reference pond methods to component instance
    Object.keys(pondRef.current)
        .filter((key) => !filteredMethods.includes(key))
        .forEach((key) => {
          FilePond[key] = pondRef.current[key];
        });

    // Clean up FilePond instance when component unmounts
    return () => {
      if (!pondRef.current) return;

      const bin = document.createElement("div");
      bin.append(pondRef.current.element);
      bin.id = "foo";

      pondRef.current.destroy();
      pondRef.current = undefined;

      elementRef.current.append(inputRef.currentClone);
    };
  }, []);

  // Prevent unnecessary updates when files are being updated
  useEffect(() => {
    if (!pondRef.current) return;

    const options = { ...props };
    delete options.onupdatefiles;

    pondRef.current.setOptions(options);
  }, [props]);

  // Render the wrapper element and input element
  return (
      <div
          className="filepond--wrapper"
          ref={elementRef}
      >
        <input
            type="file"
            name={props.name}
            id={props.id}
            accept={props.acceptedFileTypes}
            multiple={props.allowMultiple}
            required={props.required}
            className={props.className}
            capture={props.captureMethod}
        />
      </div>
  );
};

// Define filtered methods
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
