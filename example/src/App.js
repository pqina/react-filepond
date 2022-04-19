import React, { Component } from 'react';
import './App.css';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Component
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        // Set initial files, type 'local' means this is a file
        // that has already been uploaded to the server (see docs)
        files: [{
            source: 'photo.jpeg',
            options: {
                type: 'local'
            }
        }]
    };
  }

  handleInit() {
      console.log('FilePond instance has initialised', this.pond);
  }

  render() {
      return (
          <div className="App">
          
              <FilePond ref={ref => this.pond = ref}
                        files={this.state.files}
                        allowMultiple={true}
                        server={{
                            // fake server to simulate loading a 'local' server file and processing a file
                            process: (fieldName, file, metadata, load) => {
                                // simulates uploading a file
                                setTimeout(() => {
                                    load(Date.now())
                                }, 1500);
                            },
                            load: (source, load) => {
                                // simulates loading a file from the server
                                fetch(source).then(res => res.blob()).then(load);
                            }
                        }}
                        oninit={() => this.handleInit() }
                        onupdatefiles={fileItems => {
                            // Set currently active file objects to this.state
                            this.setState({
                                files: fileItems.map(fileItem => fileItem.file)
                            });
                        }}>
              </FilePond>
              
          </div>
      );
  }
}

export default App;
