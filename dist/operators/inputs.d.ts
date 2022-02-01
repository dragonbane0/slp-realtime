import { InputButtonCombo, FrameEntryType } from "../types";
import { MonoTypeOperatorFunction, OperatorFunction } from "rxjs";
/**
 * Throttle inputs for a number of frames
 */
export declare function throttleInputButtons(frames: number): MonoTypeOperatorFunction<InputButtonCombo>;
export declare function mapFramesToButtonInputs(
  index: number,
  buttons: string[],
  duration?: number,
): OperatorFunction<FrameEntryType, InputButtonCombo>;
