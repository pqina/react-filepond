# React FilePond

A FilePond component for React.

```bash
npm install react-filepond
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

Set custom processing method.

```jsx
const process = (fieldName, file, metadata, load, error, progress, abort) => {
    // handle file upload, more information here:
    // https://pqina.nl/filepond/docs/patterns/api/server/#advanced
}
<FilePond server={{ process }}></FilePond>
```
