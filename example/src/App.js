import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import { FilePond } from "./react-filepond";
import "filepond/dist/filepond.min.css";
import {registerPlugin} from "filepond"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register FilePond plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Functional component App
const App = () => {
  // Create a ref to the FilePond component instance
  const pondRef = useRef(null);
  // Manage files state
  const [files, setFiles] = useState([
    {
      source: "photo.jpeg",
      options: {
        type: "local",
      },
    },
  ]);

  // Effect to log a message when the component mounts
  useEffect(() => {
    console.log("FilePond instance has initialized", pondRef.current);
  }, []);

  // Function to handle file updates
  const handleUpdateFiles = (fileItems) => {
    setFiles(fileItems.map((fileItem) => fileItem.file));
  };

  // Render the component
  return (
      <div className="App">
        {/* FilePond component */}
        <FilePond
            ref={pondRef}
            files={files}
            allowMultiple={true}
            server={{
              // Fake server to simulate loading a 'local' server file and processing a file
              process: (fieldName, file, metadata, load) => {
                setTimeout(() => {
                  load(Date.now());
                }, 1500);
              },
              // Load a file from the server
              load: (source, load) => {
                fetch(source)
                    .then((res) => res.blob())
                    .then(load);
              },
            }}
            // Handle file updates
            onupdatefiles={handleUpdateFiles}
        />
      </div>
  );
};

export default App;
