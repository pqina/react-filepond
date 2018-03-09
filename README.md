# React FilePond

A [FilePond](https://github.com/pqina/filepond) component for React.

```bash
npm install react-filepond --save
```

Basic usage in JSX.

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
[Read the docs](https://pqina.nl/filepond/docs/patterns/frameworks/react/) for more information.

## Licensing

[Read FilePond readme for licensing options](https://github.com/pqina/filepond#license)
