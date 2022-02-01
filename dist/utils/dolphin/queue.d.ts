import type { ComboType } from "../../types";
export interface DolphinEntry {
  path: string;
  startFrame?: number;
  endFrame?: number;
  gameStation?: string;
  gameStartAt?: string;
}
export interface DolphinPlaybackItem extends DolphinEntry {
  combo?: ComboType;
}
export interface DolphinQueueOptions {
  commandId?: string;
  mode: string;
  replay: string;
  isRealTimeMode: boolean;
  outputOverlayFiles: boolean;
}
export interface DolphinQueueFormat extends DolphinQueueOptions {
  queue: DolphinEntry[];
}
declare const defaultSettings: {
  shuffle: boolean;
  mode: string;
  replay: string;
  isRealTimeMode: boolean;
  outputOverlayFiles: boolean;
  startBuffer: number;
  endBuffer: number;
};
export declare type DolphinPlaybackQueueOptions = typeof defaultSettings;
export declare const generateDolphinQueue: (
  items: DolphinPlaybackItem[],
  options?:
    | Partial<{
        shuffle: boolean;
        mode: string;
        replay: string;
        isRealTimeMode: boolean;
        outputOverlayFiles: boolean;
        startBuffer: number;
        endBuffer: number;
      }>
    | undefined,
) => DolphinQueueFormat;
export declare const generateDolphinQueuePayload: (
  items: DolphinPlaybackItem[],
  options?:
    | Partial<{
        shuffle: boolean;
        mode: string;
        replay: string;
        isRealTimeMode: boolean;
        outputOverlayFiles: boolean;
        startBuffer: number;
        endBuffer: number;
      }>
    | undefined,
  prettify?: boolean,
) => string;
export {};
