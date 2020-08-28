// See the docs for more info on any given prop
// https://pqina.nl/filepond/docs/patterns/api/filepond-instance/#setting-options

import * as React from 'react';

import {
  FilePond as Upstream_FilePond,
  FilePondOptions,
} from 'filepond';

// This line shuts off automatic exporting for this module
// I want to do this so that I can have internal types to this module that make
// understanding the type definition more clear, while at the same time only
// exporting the API that react-filepond exports.
export {};

// Copy of Omit to retain TypeScript 3.4 compatibility (Omit is a built-in since TS 3.5)
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// In addition to the React component FilePond (which is exported further below),
// react-filepond only re-exports these types:
export {
  registerPlugin,
  FileStatus,
} from 'filepond';

export interface FilePondProps extends FilePondOptions {
  acceptedFileTypes?: React.InputHTMLAttributes<any>['accept'];
}

export class FilePond extends React.Component<FilePondProps> {}

/*
According to react-filepond implementation, every FilePond instance key is cloned except these:
(see <https://github.com/pqina/react-filepond/blob/7deaee287dd24614706f2401dcf39df6207ef5ef/lib/index.js#L13>
  and <https://github.com/pqina/react-filepond/blob/7deaee287dd24614706f2401dcf39df6207ef5ef/lib/index.js#L56-L61>)

- setOptions
- on
- off
- onOnce
- appendTo
- insertAfter
- insertBefore
- isAttachedTo
- replaceElement
- restoreElement
- destroy

(as of 2020-08-27)

We mix cloned methods into FilePond class declared above by declaring FilePond a SECOND TIME
as an interface (this is possible, see <https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html#adding-using-an-interface>
"This also works with classes: [...]")
*/

type FilteredMethods = 'setOptions' | 'on' | 'off' | 'onOnce' | 'appendTo' |
  'insertAfter' | 'insertBefore' | 'isAttachedTo' |
  'replaceElement' | 'restoreElement' | 'destroy' | keyof FilePondOptions;

export interface FilePond extends Omit<Upstream_FilePond, FilteredMethods> {}
