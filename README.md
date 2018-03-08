# React FilePond

A React wrapper component for FilePond.

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
                <FilePond allowMultiple={true}>
                    {this.state.files.map(file => (
                        <File key={file} source={file} />
                    ))}
                </FilePond>
            </div>
        );
    }
}
```
