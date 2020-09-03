/*!
 * react-filepond v7.0.1
 * A handy FilePond adapter component for React
 *
 * Copyright (c) 2020 PQINA
 * https://pqina.nl/filepond
 *
 * Licensed under the MIT license.
 */

// Based on definitions by Zach Posten for React-Filepond <https://github.com/zposten>
// Updated by FilePond Contributors

// See the docs for more info on any given prop
// https://pqina.nl/filepond/docs/patterns/api/filepond-instance/#setting-options

import * as React from 'react';

import {
  FilePond as UpstreamFilePond,
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
  // (Temporarily) changed to old definition, see discussion at <https://github.com/pqina/react-filepond/pull/151>
  // acceptedFileTypes?: React.InputHTMLAttributes<any>['accept'];
  acceptedFileTypes?: string[];
}

export class FilePond extends React.Component<FilePondProps> {}

/*
According to react-filepond implementation, every FilePond instance key is cloned except some from an array, see
<https://github.com/pqina/react-filepond/blob/7deaee287dd24614706f2401dcf39df6207ef5ef/lib/index.js#L13> and
<https://github.com/pqina/react-filepond/blob/7deaee287dd24614706f2401dcf39df6207ef5ef/lib/index.js#L56-L61>.

Exluded keys as of 2020-08-27:
*/
type FilteredMethods = 'setOptions' | 'on' | 'off' | 'onOnce' | 'appendTo' |
  'insertAfter' | 'insertBefore' | 'isAttachedTo' |
  'replaceElement' | 'restoreElement' | 'destroy' | keyof FilePondOptions;

/*
We mix cloned methods into FilePond class declared above by declaring FilePond a SECOND TIME
as an interface (this is possible, see <https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html#adding-using-an-interface>
"This also works with classes: [...]")
*/

export interface FilePond extends Omit<UpstreamFilePond, FilteredMethods> {}
