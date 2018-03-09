# React FilePond

React FilePond is a handy wrapper component for [FilePond](https://github.com/pqina/filepond), a JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.

<img src="https://github.com/pqina/filepond-github-assets/blob/master/filepond-animation-01.gif" width="370" height="400" alt=""/>

Installation:

```bash
npm install react-filepond --save
```

Usage:

```jsx
import { FilePond, File } from 'react-filepond';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: ['index.html']
        };
    }

    render() {
        return (
            <div className="App">
            
                // Pass FilePond properties as attributes
                <FilePond allowMultiple={true} maxFiles={3} server='/api'>
                    
                    // Set current files using the <File/> component
                    {this.state.files.map(file => (
                        <File key={file} source={file} />
                    ))}
                    
                </FilePond>
            </div>
        );
    }
}
```
[Read the docs for more information](https://pqina.nl/filepond/docs/patterns/frameworks/react/)

## Licensing

[Read FilePond readme for licensing options](https://github.com/pqina/filepond#license)
