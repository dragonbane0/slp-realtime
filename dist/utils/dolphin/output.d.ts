/**
 * We can tap into the Dolphin state by reading the log printed to stdout.
 *
 * Dolphin will emit the following messages in following order:
 *
 * [FILE_PATH]             - path of the slp file about to be played
 * [LRAS]                  - emitted only if the game was force quit before game end
 * [PLAYBACK_START_FRAME]  - the frame playback will commence (defaults to -123 if omitted)
 * [GAME_END_FRAME]        - the last frame of the game
 * [PLAYBACK_END_FRAME]    - this frame playback will end at (defaults to MAX_INT if omitted)
 * [CURRENT_FRAME]         - the current frame being played back
 * [NO_GAME]               - no more files in the queue
 */
/// <reference types="node" />
import type { WritableOptions } from "stream";
import { Writable } from "stream";
export declare enum DolphinPlaybackStatus {
  FILE_LOADED = "FILE_LOADED",
  PLAYBACK_START = "PLAYBACK_START",
  PLAYBACK_END = "PLAYBACK_END",
  QUEUE_EMPTY = "QUEUE_EMPTY",
}
export interface DolphinPlaybackPayload {
  status: DolphinPlaybackStatus;
  data?: any;
}
export interface DolphinPlaybackInfo {
  command: string;
  value?: string;
}
interface BufferOptions {
  startBuffer: number;
  endBuffer: number;
}
export declare class DolphinOutput extends Writable {
  private buffers;
  private state;
  private streamEndedSource;
  private playbackStatusSource;
  playbackStatus$: import("rxjs").Observable<DolphinPlaybackPayload>;
  constructor(bufferOptions?: Partial<BufferOptions>, opts?: WritableOptions);
  setBuffer(bufferOptions: Partial<BufferOptions>): void;
  _write(newData: Buffer, encoding: string, callback: (error?: Error | null, data?: any) => void): void;
  private _processCommand;
  private _handleCurrentFrame;
  private _handlePlaybackStartFrame;
  private _handlePlaybackEndFrame;
  private _handleNoGame;
  private _resetState;
}
export {};
