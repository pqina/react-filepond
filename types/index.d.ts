// Based on definitions by Zach Posten for React-Filepond <https://github.com/zposten>
// Updated by FilePond Contributors

import * as React from 'react';

// This line shuts off automatic exporting for this module
// I want to do this so that I can have internal types to this module that make
// understanding the type definition more clear, while at the same time only
// exporting the API that react-filepond exports.
export {};

export enum FileStatus {
  INIT = 1,
  IDLE = 2,
  PROCESSING_QUEUED = 9,
  PROCESSING = 3,
  PROCESSING_COMPLETE = 5,
  PROCESSING_ERROR = 6,
  PROCESSING_REVERT_ERROR = 10,
  LOADING = 7,
  LOAD_ERROR = 8,
}

export enum Status {
  EMPTY = 0,
  IDLE = 1,
  ERROR = 2,
  BUSY = 3,
  READY = 4,
}

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

// Note that this duplicates the JS File type declaration, but is necessary
// to avoid duplicating the name 'File' in this module
// see: https://developer.mozilla.org/en-US/docs/Web/API/File
// see: https://github.com/Microsoft/dtslint/issues/173
// see: https://stackoverflow.com/q/53876793/2517147
type ActualFileObject = Blob & {
  readonly lastModified: number;
  readonly name: string;
};

/**
 * A custom FilePond File.
 */
export class FilePondFile extends React.Component<FileProps> {
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

// TODO delete
/**
 * A custom FilePond File. Don't confuse this with the native `File` type.
 *
 * @deprecated use `FilePondFile` instead. This type will be removed in a future release.
 */
export class File extends FilePondFile {}

interface ServerUrl {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  withCredentials?: boolean;
  headers?: { [key: string]: string | boolean | number };
  timeout?: number;

  /**
   * Called when server response is received, useful for getting
   * the unique file id from the server response.
   */
  onload?: (response: any) => number | string;
  /**
   * Called when server error is received, receives the response
   * body, useful to select the relevant error data.
   */
  onerror?: (responseBody: any) => any;
  /**
   * Called with the formdata object right before it is sent,
   * return extended formdata object to make changes.
   */
  ondata?: (data: FormData) => FormData;
}

type ProgressServerConfigFunction = (
  /**
   * Flag indicating if the resource has a length that can be calculated.
   * If not, the totalDataAmount has no significant value.  Setting this to
   * false switches the FilePond loading indicator to infinite mode.
   */
  isLengthComputable: boolean,
  /** The amount of data currently transferred. */
  loadedDataAmount: number,
  /** The total amount of data to be transferred. */
  totalDataAmount: number
) => void;

type ProcessServerConfigFunction = (
  /** The name of the input field. */
  fieldName: string,
  /** The actual file object to send. */
  file: ActualFileObject,
  metadata: { [key: string]: any },
  /**
   * Should call the load method when done and pass the returned server file id.
   * This server file id is then used later on when reverting or restoring a file
   * so that your server knows which file to return without exposing that info
   * to the client.
   */
  load: (p: string | { [key: string]: any }) => void,
  /** Call if something goes wrong, will exit after. */
  error: (errorText: string) => void,
  /**
   * Should call the progress method to update the progress to 100% before calling load().
   * Setting computable to false switches the loading indicator to infinite mode.
   */
  progress: ProgressServerConfigFunction,
  /** Let FilePond know the request has been cancelled. */
  abort: () => void
) => void;

type RevertServerConfigFunction = (
  /** Server file id of the file to restore. */
  uniqueFieldId: any,
  /** Should call the load method when done. */
  load: () => void,
  /** Call if something goes wrong, will exit after. */
  error: (errorText: string) => void
) => void;

type RestoreServerConfigFunction = (
  /** Server file id of the file to restore. */
  uniqueFileId: any,
  /** Should call the load method with a file object or blob when done. */
  load: (file: ActualFileObject) => void,
  /** Call if something goes wrong, will exit after. */
  error: (errorText: string) => void,
  /**
   * Should call the progress method to update the progress to 100% before calling load().
   * Setting computable to false switches the loading indicator to infinite mode.
   */
  progress: ProgressServerConfigFunction,
  /** Let FilePond know the request has been cancelled. */
  abort: () => void,
  /**
   * Can call the headers method to supply FilePond with early response header string.
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
   */
  headers: (headersString: string) => void
) => void;

type LoadServerConfigFunction = (
  source: any,
  /** Should call the load method with a file object or blob when done. */
  load: (file: ActualFileObject | Blob) => void,
  /** Call if something goes wrong, will exit after. */
  error: (errorText: string) => void,
  /**
   * Should call the progress method to update the progress to 100% before calling load().
   * Setting computable to false switches the loading indicator to infinite mode.
   */
  progress: ProgressServerConfigFunction,
  /** Let FilePond know the request has been cancelled. */
  abort: () => void,
  /**
   * Can call the headers method to supply FilePond with early response header string.
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders>
   */
  headers: (headersString: string) => void
) => void;

type FetchServerConfigFunction = (
  url: string,
  /** Should call the load method with a file object or blob when done. */
  load: (file: ActualFileObject | Blob) => void,
  /** Call if something goes wrong, will exit after. */
  error: (errorText: string) => void,
  /**
   * Should call the progress method to update the progress to 100% before calling load().
   * Setting computable to false switches the loading indicator to infinite mode.
   */
  progress: ProgressServerConfigFunction,
  /** Let FilePond know the request has been cancelled. */
  abort: () => void,
  /**
   * Can call the headers method to supply FilePond with early response header string.
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
   */
  headers: (headersString: string) => void
) => void;

export type RemoveServerConfigFunction = (
  /** Local file source */
  source: any,
  /** Call when done */
  load: () => void,
  /** Call if something goes wrong, will exit after. */
  error: (errorText: string) => void
) => void;

export interface FilePondInitialFile {
  /** The server file reference. */
  source: string;
  options: {
    /** Origin of file being added. */
    type: 'input' | 'limbo' | 'local';
    /** Mock file information. */
    file?: {
      name?: string;
      size?: number;
      type?: string;
    };
    /** File initial metadata. */
    metadata?: { [key: string]: any };
  };
}

export interface FilePondServerConfigProps {
  /**
   * Immediately upload new files to the server.
   */
  instantUpload?: boolean;
  /**
   * The maximum number of files that can be uploaded in parallel.
   */
  maxParallelUploads?: number;

  /**
   * Server API Configuration.
   * See: https://pqina.nl/filepond/docs/patterns/api/server
   */
  server?:
    | string
    | {
        url?: string;
        timeout?: number;
        headers?: { [key: string]: string | boolean | number };
        process?: string | ServerUrl | ProcessServerConfigFunction | null;
        revert?: string | ServerUrl | RevertServerConfigFunction | null;
        restore?: string | ServerUrl | RestoreServerConfigFunction | null;
        load?: string | ServerUrl | LoadServerConfigFunction | null;
        fetch?: string | ServerUrl | FetchServerConfigFunction | null;
        remove?: RemoveServerConfigFunction | null;
      }
    | null;

  /**
   * Enable chunk uploads
   */
  chunkUploads?: boolean;
  /**
   * Force use of chunk uploads even for files smaller than chunk size
   */
  chunkForce?: boolean;
  /**
   * Size of chunks (5MB default)
   */
  chunkSize?: number;
  /**
   * Amount of times to retry upload of a chunk when it fails
   */
  chunkRetryDelays?: number[];

  /**
   * A list of file locations that should be loaded immediately.
   * See: https://pqina.nl/filepond/docs/patterns/api/filepond-object/#setting-initial-files
   */
  files?: Array<FilePondInitialFile | ActualFileObject | Blob | string>;
}

export interface FilePondDragDropProps {
  /**
   * FilePond will catch all files dropped on the webpage.
   */
  dropOnPage?: boolean;
  /**
   * Require drop on the FilePond element itself to catch the file.
   */
  dropOnElement?: boolean;
  /**
   * When enabled, files are validated before they are dropped.
   * A file is not added when it’s invalid.
   */
  dropValidation?: boolean;
  /**
   * Ignored file names when handling dropped directories.
   * Dropping directories is not supported on all browsers.
   */
  ignoredFiles?: string[];
}

export interface FilePondLabelProps {
  /**
   * The decimal separator used to render numbers.
   * By default this is determined automatically.
   */
  labelDecimalSeparator?: string;
  /**
   * The thousands separator used to render numbers.
   * By default this is determined automatically.
   */
  labelThousandsSeparator?: string;
  /**
   * Default label shown to indicate this is a drop area.
   * FilePond will automatically bind browse file events to
   * the element with CSS class .filepond--label-action.
   */
  labelIdle?: string;
  /**
   * Label shown when the field contains invalid files and is validated by the parent form.
   */
  labelInvalidField?: string;
  /**
   * Label used while waiting for file size information.
   */
  labelFileWaitingForSize?: string;
  /**
   * Label used when no file size information was received.
   */
  labelFileSizeNotAvailable?: string;
  /**
   * Label used when showing the number of files and there is only one.
   */
  labelFileCountSingular?: string;
  /**
   * Label used when showing the number of files and there is more than one.
   */
  labelFileCountPlural?: string;
  /**
   * Label used while loading a file.
   */
  labelFileLoading?: string;
  /**
   * Label used when file is added (assistive only).
   */
  labelFileAdded?: string;
  /**
   * Label used when file load failed.
   */
  labelFileLoadError?: ((error: any) => string) | string;
  /**
   * Label used when file is removed (assistive only).
   */
  labelFileRemoved?: string;
  /**
   * Label used when something went during during removing the file upload.
   */
  labelFileRemoveError?: ((error: any) => string) | string;
  /**
   * Label used when uploading a file.
   */
  labelFileProcessing?: string;
  /**
   * Label used when file upload has completed.
   */
  labelFileProcessingComplete?: string;
  /**
   * Label used when upload was cancelled.
   */
  labelFileProcessingAborted?: string;
  /**
   * Label used when something went wrong during file upload.
   */
  labelFileProcessingError?: ((error: any) => string) | string;
  /**
   * Label used when something went wrong during reverting the file upload.
   */
  labelFileProcessingRevertError?: ((error: any) => string) | string;
  /**
   * Label used to indicate to the user that an action can be cancelled.
   */
  labelTapToCancel?: string;
  /**
   * Label used to indicate to the user that an action can be retried.
   */
  labelTapToRetry?: string;
  /**
   * Label used to indicate to the user that an action can be undone.
   */
  labelTapToUndo?: string;
  /**
   * Label used for remove button.
   */
  labelButtonRemoveItem?: string;
  /**
   * Label used for abort load button.
   */
  labelButtonAbortItemLoad?: string;
  /**
   * Label used for retry load.
   */
  labelButtonRetryItemLoad?: string;
  /**
   * Label used for abort upload button.
   */
  labelButtonAbortItemProcessing?: string;
  /**
   * Label used for undo upload button.
   */
  labelButtonUndoItemProcessing?: string;
  /**
   * Label used for retry upload button.
   */
  labelButtonRetryItemProcessing?: string;
  /**
   * Label used for upload button.
   */
  labelButtonProcessItem?: string;
}

export interface FilePondSvgIconProps {
  /**
   * The icon used for remove actions.
   */
  iconRemove?: string;
  /**
   * The icon used for process actions.
   */
  iconProcess?: string;
  /**
   * The icon used for retry actions.
   */
  iconRetry?: string;
  /**
   * The icon used for undo actions.
   */
  iconUndo?: string;
  /**
   * The icon used for done.
   */
  iconDone?: string;
}

interface FilePondErrorDescription {
  type: string;
  code: number;
  body: string;
}

export interface FilePondCallbackProps {
  /** FilePond instance has been created and is ready. */
  oninit?: () => void;
  /**
   * FilePond instance throws a warning. For instance
   * when the maximum amount of files has been reached.
   * Optionally receives file if error is related to a
   * file object.
   */
  onwarning?: (error: any, file?: FilePondFile, status?: any) => void;
  /**
   * FilePond instance throws an error. Optionally receives
   * file if error is related to a file object.
   */
  onerror?: (
    error: FilePondErrorDescription,
    file?: FilePondFile,
    status?: any
  ) => void;
  /** Started file load. */
  onaddfilestart?: (file: FilePondFile) => void;
  /** Made progress loading a file. */
  onaddfileprogress?: (file: FilePondFile, progress: number) => void;
  /** If no error, file has been successfully loaded. */
  onaddfile?: (
    error: FilePondErrorDescription | null,
    file: FilePondFile
  ) => void;
  /** Started processing a file. */
  onprocessfilestart?: (file: FilePondFile) => void;
  /** Made progress processing a file. */
  onprocessfileprogress?: (file: FilePondFile, progress: number) => void;
  /** Aborted processing of a file. */
  onprocessfileabort?: (file: FilePondFile) => void;
  /** Processing of a file has been reverted. */
  onprocessfilerevert?: (file: FilePondFile) => void;
  /** If no error, Processing of a file has been completed. */
  onprocessfile?: (
    error: FilePondErrorDescription | null,
    file: FilePondFile
  ) => void;
  /** Called when all files in the list have been processed. */
  onprocessfiles?: () => void;
  /** File has been removed. */
  onremovefile?: (
    error: FilePondErrorDescription | null,
    file: FilePondFile
  ) => void;
  /**
   * File has been transformed by the transform plugin or
   * another plugin subscribing to the prepare_output filter.
   * It receives the file item and the output data.
   */
  onpreparefile?: (file: FilePondFile, output: any) => void;
  /** A file has been added or removed, receives a list of file items. */
  onupdatefiles?: (files: FilePondFile[]) => void;
  /* Called when a file is clicked or tapped. **/
  onactivatefile?: (file: FilePondFile) => void;
  /** Called when the files have been reordered */
  onreorderfiles?: (files: FilePondFile[]) => void;
}

export interface FilePondHookProps {
  /**
   * FilePond is about to allow this item to be dropped, it can be a URL or a File object.
   *
   * Return `true` or `false` depending on if you want to allow the item to be dropped.
   */
  beforeDropFile?: (file: FilePondFile | string) => boolean;
  /**
   * FilePond is about to add this file.
   *
   * Return `false` to prevent adding it, or return a `Promise` and resolve with `true` or `false`.
   */
  beforeAddFile?: (item: FilePondFile) => boolean | Promise<boolean>;
  /**
   * FilePond is about to remove this file.
   *
   * Return `false` to prevent adding it, or return a `Promise` and resolve with `true` or `false`.
   */
  beforeRemoveFile?: (item: FilePondFile) => boolean | Promise<boolean>;
}

export interface FilePondStyleProps {
  /**
   * Set a different layout render mode.
   */
  stylePanelLayout?: 'integrated' | 'compact' | 'circle' | null;
  /**
   * Set a forced aspect ratio for the FilePond drop area.
   *
   * Accepts human readable aspect ratios like `1:1` or numeric aspect ratios like `0.75`.
   */
  stylePanelAspectRatio?: string | null;
  /**
   * Set a forced aspect ratio for the file items.
   *
   * Useful when rendering cropped or fixed aspect ratio images in grid view.
   */
  styleItemPanelAspectRatio?: string | null;
  /**
   * The position of the remove item button.
   */
  styleButtonRemoveItemPosition?: string;
  /**
   * The position of the remove item button.
   */
  styleButtonProcessItemPosition?: string;
  /**
   * The position of the load indicator.
   */
  styleLoadIndicatorPosition?: string;
  /**
   * The position of the progress indicator.
   */
  styleProgressIndicatorPosition?: string;
  /**
   * Enable to align the remove button to the left side of the file item.
   */
  styleButtonRemoveItemAlign?: boolean;
}

export type CaptureAttribute = 'camera' | 'microphone' | 'camcorder';

export interface FilePondBaseProps {
  /**
   * The ID to add to the root element.
   */
  id?: string | null;
  /**
   * The input field name to use.
   */
  name?: string;
  /**
   * Class Name to put on wrapper.
   */
  className?: string | null;
  /**
   * Sets the required attribute to the output field.
   */
  required?: boolean;
  /**
   * Sets the disabled attribute to the output field.
   */
  disabled?: boolean;
  /**
   * Sets the given value to the capture attribute.
   */
  captureMethod?: CaptureAttribute | null;
  /**
   * Set to false to prevent FilePond from setting the file input field `accept` attribute to the value of the `acceptedFileTypes`.
   */
  allowSyncAcceptAttribute?: boolean;
  /**
   * Enable or disable drag n’ drop.
   */
  allowDrop?: boolean;
  /**
   * Enable or disable file browser.
   */
  allowBrowse?: boolean;
  /**
   * Enable or disable pasting of files. Pasting files is not
   * supported on all browsers.
   */
  allowPaste?: boolean;
  /**
   * Enable or disable adding multiple files.
   */
  allowMultiple?: boolean;
  /**
   * Allow drop to replace a file, only works when allowMultiple is false.
   */
  allowReplace?: boolean;
  /**
   * Allows the user to revert file upload.
   */
  allowRevert?: boolean;
  /**
   * Allows user to process a file. When set to false, this removes the file upload button.
   */
  allowProcess?: boolean;
  /**
   * Allows the user to reorder the file items
   */
  allowReorder?: boolean;
  /**
   * Allow only selecting directories with browse (no support for filtering dnd at this point)
   */
  allowDirectoriesOnly?: boolean;

  /**
   * Require the file to be successfully reverted before continuing.
   */
  forceRevert?: boolean;

  /**
   * The maximum number of files that filepond pond can handle.
   */
  maxFiles?: number | null;
  /**
   * Enables custom validity messages.
   */
  checkValidity?: boolean;

  /**
   * Set to false to always add items to beginning or end of list.
   */
  itemInsertLocationFreedom?: boolean;
  /**
   * Default index in list to add items that have been dropped at the top of the list.
   */
  itemInsertLocation?:
    | 'before'
    | 'after'
    | ((a: FilePondFile, b: FilePondFile) => number);
  /**
   * The interval to use before showing each item being added to the list.
   */
  itemInsertInterval?: number;
}

export interface FilePondOptions
  extends FilePondDragDropProps,
    FilePondServerConfigProps,
    FilePondLabelProps,
    FilePondSvgIconProps,
    FilePondCallbackProps,
    FilePondHookProps,
    FilePondStyleProps,
    FilePondBaseProps {}

export class FilePond extends React.Component<FilePondOptions> {
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
