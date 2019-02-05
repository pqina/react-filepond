# Changelog

## 7.0.0

- Update `filepond` peer dependency to match version 4.0.0
- Add example folder


## 6.0.1

- Fix typo in README


## 6.0.0

- Removed `<File>` component, it created the illusion that it was possible to modify the HTML of FilePond which is not possible. This also simplifies the component making it easier to maintain and keep in sync with FilePond core.

- You can now set files using the `files` prop, similar to how it is set on the JavaScript version of FilePond.

- Fixed problem where syncing the FilePond internal state with the component state would sometimes not work properly.

- Please make sure you update FilePond core dependency to 3.7.7

- Add CHANGELOG.md


## For earlier changes, please see commit history