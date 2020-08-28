/*!
 * react-filepond v7.0.2
 * A handy FilePond adapter component for React
 *
 * Copyright (c) 2020 PQINA
 * https://pqina.nl/filepond
 *
 * Licensed under the MIT license.
 */

// Based on definitions by Zach Posten for React-Filepond <https://github.com/zposten>
// Updated by FilePond Contributors

import { Component } from 'react';
import {
  FileStatus,
  ActualFileObject,
  FilePondInitialFile,
  FilePondOptions,
} from 'filepond';

export {
  FileStatus,
  Status,
  ActualFileObject,
  File,
  RemoveServerConfigFunction,
  FilePondInitialFile,
  FilePondServerConfigProps,
  FilePondLabelProps,
  FilePondSvgIconProps,
  FilePondCallbackProps,
  FilePondHookProps,
  FilePondStyleProps,
  CaptureAttribute,
  FilePondBaseProps,
  FilePondOptions,
  FilePondOptions as FilePondProps, // To be DELETED
  FilePondDragDropProps,
} from 'filepond';

type FilePondOrigin =
  | 'input' // Added by user
  | 'limbo' // Temporary server file
  | 'local'; // Existing server file

export interface FileProps {
  src: string;
  name?: string;
  size?: number;
  type?: string;
  origin?: FilePondOrigin;
  metadata?: { [key: string]: any };
}

/**
 * A custom FilePond File.
 */
export class FilePondFile extends Component<FileProps> {
  /** Returns the ID of the file. */
  id: string;
  /** Returns the server id of the file. */
  serverId: string;
  /** Returns the source of the file. */
  source: ActualFileObject | string;
  /** Returns the origin of the file. */
  origin: FilePondOrigin;
  /** Returns the current status of the file. */
  status: FileStatus;
  /** Returns the File object. */
  file: ActualFileObject;
  /** Returns the file extensions. */
  fileExtension: string;
  /** Returns the size of the file. */
  fileSize: number;
  /** Returns the type of the file. */
  fileType: string;
  /** Returns the full name of the file. */
  filename: string;
  /** Returns the name of the file without extension. */
  filenameWithoutExtension: string;

  /** Aborts loading of this file */
  abortLoad: () => void;
  /** Aborts processing of this file */
  abortProcessing: () => void;
  /**
   * Retrieve metadata saved to the file, pass a key to retrieve
   * a specific part of the metadata (e.g. 'crop' or 'resize').
   * If no key is passed, the entire metadata object is returned.
   */
  getMetadata: (key?: string) => any;
  /** Add additional metadata to the file */
  setMetadata: (key: string, value: any) => void;
}

export class FilePond extends Component<FilePondOptions> {
  /** Override multiple options at once. */
  setOptions: (options: FilePondOptions) => void;
  /**
   * Adds a file.
   * @param options.index The index that the file should be added at.
   */
  addFile: (
    source: ActualFileObject | Blob | string,
    options?: { index?: number } & Partial<FilePondInitialFile['options']>
  ) => Promise<FilePondFile>;
  /**
   * Adds multiple files.
   * @param options.index The index that the files should be added at.
   */
  addFiles: (
    source: ActualFileObject[] | Blob[] | string[],
    options?: { index: number }
  ) => Promise<FilePondFile[]>;
  /**
   * Moves a file. Select file with query and supply target index.
   * @param query The file reference, id, or index.
   * @param index The index to move the file to.
   */
  moveFile: (query: FilePondFile | string | number, index: number) => void;
  /**
   * Removes a file. If no parameter is provided, removes the first file in the list.
   * @param query The file reference, id, or index.
   */
  removeFile: (query?: FilePondFile | string | number) => void;
  /** Removes all files. */
  removeFiles: () => void;
  /**
   * Processes a file. If no parameter is provided, processes the first file in the list.
   * @param query The file reference, id, or index
   */
  processFile: (
    query?: FilePondFile | string | number
  ) => Promise<FilePondFile>;
  /**
   * Processes multiple files. If no parameter is provided, processes all files.
   * @param query The file reference(s), id(s), or index(es)
   */
  processFiles: (
    query?: FilePondFile[] | string[] | number[]
  ) => Promise<FilePondFile[]>;
  /**
   * Returns a file. If no parameter is provided, returns the first file in the list.
   * @param query The file id, or index
   */
  getFile: (query?: string | number) => FilePondFile;
  /** Returns all files. */
  getFiles: () => FilePondFile[];
  /**
   * Manually trigger the browse files panel.
   *
   * Only works if the call originates from the user.
   */
  browse: () => void;
  /**
   * Sort the items in the files list.
   * @param compare The comparison function
   */
  sort: (compare: (a: FilePondFile, b: FilePondFile) => number) => void;
}

/** Creates a new FilePond instance. */
export function create(element?: Element, options?: FilePondOptions): FilePond;
/** Destroys the FilePond instance attached to the supplied element. */
export function destroy(element: Element): void;
/** Returns the FilePond instance attached to the supplied element. */
export function find(element: Element): FilePond;
/**
 * Parses a given section of the DOM tree for elements with class
 * .filepond and turns them into FilePond elements.
 */
export function parse(context: Element): void;
/** Registers a FilePond plugin for later use. */
export function registerPlugin(...plugins: any[]): void;
/** Sets page level default options for all FilePond instances. */
export function setOptions(options: FilePondOptions): void;
/** Returns the current default options. */
export function getOptions(): FilePondOptions;
/** Determines whether or not the browser supports FilePond. */
export function supported(): boolean;
