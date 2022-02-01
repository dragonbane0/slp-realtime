/// <reference types="node" />
import { ChildProcessWithoutNullStreams } from "child_process";
import { DolphinOutput } from "./output";
declare const defaultDolphinLauncherOptions: {
  dolphinPath: string;
  meleeIsoPath: string;
  batch: boolean;
  disableSeekBar: boolean;
  readEvents: boolean;
  startBuffer: number;
  endBuffer: number;
};
export declare type DolphinLauncherOptions = typeof defaultDolphinLauncherOptions;
export declare class DolphinLauncher {
  output: DolphinOutput;
  dolphin: ChildProcessWithoutNullStreams | null;
  protected options: DolphinLauncherOptions;
  private dolphinRunningSource;
  dolphinRunning$: import("rxjs").Observable<boolean>;
  constructor(options?: Partial<DolphinLauncherOptions>);
  updateSettings(options: Partial<DolphinLauncherOptions>): void;
  loadJSON(comboFilePath: string): void;
  private _startDolphin;
}
export {};
