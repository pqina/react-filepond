# React FilePond

React FilePond is a handy wrapper component for [FilePond](https://github.com/pqina/filepond), a JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pqina/react-filepond/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/react-filepond.svg)](https://www.npmjs.com/package/react-filepond)
[![Support on Patreon](https://img.shields.io/badge/support-patreon-salmon.svg)](https://www.patreon.com/rikschennink)

<img src="https://github.com/pqina/filepond-github-assets/blob/master/filepond-animation-01.gif" width="370" alt=""/>


## Thinking of learning React?

Want to learn React but you don't know where to start? I highly recommend [React for Beginners](http://bit.ly/react-course) by Wes Bos.

If you're already familiar with React and want to brush up your skills [Advanced React](http://bit.ly/react-advanced-course) is a great way to do so.


## Installation

```bash
npm install react-filepond filepond --save
```

Usage:

```jsx
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Our app
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Set initial files, type 'local' means this is a file
            // that has already been uploaded to the server (see docs)
            files: [{
                source: 'index.html',
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
            
                {/* Pass FilePond properties as attributes */}
                <FilePond ref={ref => this.pond = ref}
                          files={this.state.files}
                          allowMultiple={true}
                          maxFiles={3} 
                          server="/api"
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
```

[Read the docs for more information](https://pqina.nl/filepond/docs/patterns/frameworks/react/)