# React FilePond

React FilePond is a handy wrapper component for [FilePond](https://github.com/pqina/filepond), a JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pqina/react-filepond/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/react-filepond.svg)](https://www.npmjs.com/package/react-filepond)
[![Donate with PayPal](https://img.shields.io/badge/donate-PayPal.me-pink.svg)](https://www.paypal.me/rikschennink/10)

<img src="https://github.com/pqina/filepond-github-assets/blob/master/filepond-animation-01.gif" width="370" alt=""/>

Installation:

```bash
npm install react-filepond --save
```

Usage:

```jsx
import React, { Component } from "react";
import { FilePond, File, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Register plugin
import FilePondImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondImagePreview);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    };
  }

  handleInit() {
    console.log("now initialised", this.pond);
  }

  handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
    // handle file upload here
  }

  render() {
    return (
      <div className="App">
        {/* Pass FilePond properties as attributes */}
        <FilePond
          allowMultiple={true}
          maxFiles={3}
          ref={ref => (this.pond = ref)}
          server={{ process: this.handleProcessing.bind(this) }}
          oninit={() => this.handleInit()}
        >
          {/* Set current files using the component */}
          <File />
          {this.state.files.map(file => <File key={file} source={file} />)}
        </FilePond>
      </div>
    );
  }
}

export default App;
```

[Read the docs for more information](https://pqina.nl/filepond/docs/patterns/frameworks/react/)
