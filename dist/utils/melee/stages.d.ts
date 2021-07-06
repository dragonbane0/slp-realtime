import { Stage } from "@slippi/slippi-js";
export { Stage } from "@slippi/slippi-js";
export interface StageInfo {
  id: Stage;
  name: string;
  shortName?: string;
}
export declare function getStageInfo(stageId: number): StageInfo;
export declare function getStageName(stageId: number): string;
export declare function getStageShortName(stageId: number): string;
