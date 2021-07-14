# React FilePond

React FilePond is a handy wrapper component for [FilePond](https://github.com/pqina/filepond), a JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pqina/react-filepond/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/react-filepond.svg)](https://www.npmjs.com/package/react-filepond)
![npm](https://img.shields.io/npm/dt/react-filepond)

---

[<img src="https://github.com/pqina/filepond-github-assets/blob/master/header.svg" alt="FilePond"/>](https://www.buymeacoffee.com/rikschennink/)

[Buy me a Coffee](https://www.buymeacoffee.com/rikschennink/) / [Use FilePond with Pintura](https://pqina.nl/pintura/?ref=github-filepond) / [Dev updates on Twitter](https://twitter.com/rikschennink/)

---

### Core Features

*   Accepts **directories**, **files**, blobs, local URLs, **remote URLs** and Data URIs.
*   **Drop files**, select on filesystem, **copy and paste files**, or add files using the API.
*   **Async uploading** with AJAX, or encode files as base64 data and send along form post.
*   **Accessible**, tested with AT software like VoiceOver and JAWS, **navigable by Keyboard**.
*   **Image optimization**, automatic image resizing, **cropping**, and **fixes EXIF orientation**.
*   **Responsive**, automatically scales to available space, is functional on both **mobile and desktop devices**.

[Learn more about FilePond](https://pqina.nl/filepond/)

<img src="https://github.com/pqina/filepond-github-assets/blob/master/filepond-animation-01.gif" width="370" alt=""/>


---

### Also need Image Editing?

**Pintura the modern JavaScript Image Editor** is what you're looking for. Pintura supports setting **crop aspect ratios**, **resizing**, **rotating**, **cropping**, and **flipping** images. Above all, it integrates beautifully with FilePond.

[Learn more about Pintura](https://pqina.nl/pintura/?ref=github-react-filepond)

<img src="https://github.com/pqina/filepond-github-assets/blob/master/filepond_pintura.gif?raw=true" width="600" alt=""/>

---


## Installation

```bash
npm install react-filepond filepond --save
```

Hooks:

```jsx
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// Import React FilePond
import { FilePond, File, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

// Our app
function App() {
  const [files, setFiles] = useState([])
  return (
    <div className="App">
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={3}
        server="/api"
        name="files" {/* sets the file input name, it's filepond by default */}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  )
}
```


Component:

```jsx
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Our app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [
        {
          source: "index.html",
          options: {
            type: "local"
          }
        }
      ]
    };
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  render() {
    return (
      <div className="App">
        <FilePond
          ref={ref => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={true}
          allowReorder={true}
          maxFiles={3}
          server="/api"
          name="files" {/* sets the file input name, it's filepond by default */}
          oninit={() => this.handleInit()}
          onupdatefiles={fileItems => {
            // Set currently active file objects to this.state
            this.setState({
              files: fileItems.map(fileItem => fileItem.file)
            });
          }}
        />
      </div>
    );
  }
}

```

[Read the docs for more information](https://pqina.nl/filepond/docs/patterns/frameworks/react/)

[Live Demo on Code Sandbox](https://codesandbox.io/s/react-filepond-live-demo-iw9ri)
