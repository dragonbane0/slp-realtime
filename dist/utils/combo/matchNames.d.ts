import { GameStartType } from "../../types";
export declare function extractPlayerNames(settings: GameStartType, metadata?: any, playerIndex?: number): string[];
export declare function namesMatch(lookingForNametags: string[], inGameTags: string[], fuzzyMatch?: boolean): boolean;
