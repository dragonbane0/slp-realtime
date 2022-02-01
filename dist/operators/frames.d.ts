import type { MonoTypeOperatorFunction, OperatorFunction } from "rxjs";
import type { FrameEntryType } from "../types";
/**
 * Filter the frames to only those that belong to the player {index}.
 */
export declare function playerFrameFilter(index: number): MonoTypeOperatorFunction<FrameEntryType>;
/**
 * Return the previous frame of the game and the current frame
 */
export declare function withPreviousFrame<
  T extends {
    frame: number | null;
  }
>(): OperatorFunction<T, [T, T]>;
/**
 * Return the previous frame of the game and the current frame
 */
export declare function filterOnlyFirstFrame<
  T extends {
    frame: number;
  }
>(): MonoTypeOperatorFunction<T>;
