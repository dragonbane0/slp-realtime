import type { ComboType, GameStartType, MetadataType } from "../../types";
import { Character } from "../melee";
export interface ComboFilterSettings {
  chainGrabbers: Character[];
  characterFilter: Character[];
  portFilter: number[];
  nameTags: string[];
  minComboLength: number;
  minComboPercent: number;
  comboMustKill: boolean;
  excludeCPUs: boolean;
  excludeChainGrabs: boolean;
  excludeWobbles: boolean;
  largeHitThreshold: number;
  wobbleThreshold: number;
  chainGrabThreshold: number;
  perCharacterMinComboPercent: {
    [characterId: number]: number;
  };
  fuzzyNameTagMatching: boolean;
}
export declare type Criteria = (
  combo: ComboType,
  settings: GameStartType,
  options: ComboFilterSettings,
  metadata?: MetadataType | null,
) => boolean;
export declare const defaultComboFilterSettings: ComboFilterSettings;
export declare class ComboFilter {
  criteria: Criteria[];
  private settings;
  private originalSettings;
  constructor(options?: Partial<ComboFilterSettings>);
  updateSettings(options: Partial<ComboFilterSettings>): ComboFilterSettings;
  getSettings(): ComboFilterSettings;
  resetSettings(): ComboFilterSettings;
  isCombo(combo: ComboType, settings: GameStartType, metadata?: MetadataType | null): boolean;
}
export declare const checkCombo: (
  comboSettings: ComboFilterSettings,
  combo: ComboType,
  gameSettings: GameStartType,
  metadata?: MetadataType | null | undefined,
  criteria?: Criteria[] | undefined,
) => boolean;
