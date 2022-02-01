/// <reference types="node" />
import type { FrameEntryType, FramesType, GameEndType, GameStartType, SlpFileWriterOptions } from "@slippi/slippi-js";
import { Command, SlpFileWriter, SlpParser } from "@slippi/slippi-js";
import type { WritableOptions } from "stream";
export { SlpStreamEvent, SlpStreamMode, SlpStreamSettings } from "@slippi/slippi-js";
/**
 * SlpStream is a writable stream of Slippi data. It passes the data being written in
 * and emits an event based on what kind of Slippi messages were processed.
 *
 * @class SlpStream
 * @extends {Writable}
 */
export declare class RxSlpStream extends SlpFileWriter {
  protected parser: SlpParser;
  private messageSizeSource;
  private allFrames;
  messageSize$: import("rxjs").Observable<Map<Command, number>>;
  gameStart$: import("rxjs").Observable<GameStartType>;
  playerFrame$: import("rxjs").Observable<FrameEntryType>;
  gameEnd$: import("rxjs").Observable<GameEndType>;
  allFrames$: import("rxjs").Observable<{
    allFrames: FramesType;
    latestFrame: FrameEntryType;
  }>;
  /**
   *Creates an instance of SlpStream.
   * @param {Partial<SlpStreamSettings>} [slpOptions]
   * @param {WritableOptions} [opts]
   * @memberof SlpStream
   */
  constructor(options?: Partial<SlpFileWriterOptions>, opts?: WritableOptions);
  restart(): void;
}
