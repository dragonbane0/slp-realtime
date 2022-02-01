/// <reference types="node" />
import type { SlpFileWriterOptions } from "@slippi/slippi-js";
import type { WritableOptions } from "stream";
import { RxSlpStream } from "./rxSlpStream";
/**
 * SlpFolderStream is responsible for monitoring a folder, and detecting
 * when a new SLP file is created and is written to. This creates
 * essentially a fake live-stream by reading the SLP file as it's
 * still being written to.
 *
 * Typically when you detect changes to a file that is still being written
 * to, you want to include a timeout where if the file isn't changed within
 * that timeout, you consider it "done" and stop checking it. However, since
 * players can pause Slippi games for an indefinite amount of time, we don't
 * want to timeout since the file might still continue to be written to. So to achieve
 * this, we use the package `tailstream` where we have to manually call `done()`
 * when we no longer anticipate the file to change.
 *
 * @extends {RxSlpStream}
 */
export declare class SlpFolderStream extends RxSlpStream {
  private stopRequested$;
  private newFile$;
  private readStream;
  private fileWatcher;
  constructor(options?: Partial<SlpFileWriterOptions>, opts?: WritableOptions);
  private _setupSubjects;
  private endReadStream;
  private stopFileWatcher;
  /**
   * Starts watching a particular folder for slp files. It treats all new
   * `.slp` files as though it's a live Slippi stream.
   *
   * @param {string} slpFolder
   * @memberof SlpFolderStream
   */
  start(
    slpFolder: string,
    options?: {
      includeSubfolders?: boolean;
    },
  ): Promise<void>;
  stop(): void;
  /**
   * Returns the latest created file that was found by folder monitoring.
   */
  latestFile(): string | null;
}
