import type { GameStartType } from "../../types";
export declare function extractPlayerNamesByPort(settings: GameStartType, metadata?: any): string[][];
export declare function extractPlayerNames(settings: GameStartType, metadata?: any): string[];
export declare function namesMatch(lookingForNametags: string[], inGameTags: string[], fuzzyMatch?: boolean): boolean;
