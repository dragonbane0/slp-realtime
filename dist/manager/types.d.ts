import { ComboFilterSettings } from "../utils";
import { PlayerIndexFilter } from "../types";
export declare enum ComboEvent {
  START = "combo-start",
  EXTEND = "combo-extend",
  END = "combo-occurred",
  CONVERSION = "conversion-occurred",
}
export declare enum GameEvent {
  GAME_START = "game-start",
  GAME_END = "game-end",
}
export declare enum InputEvent {
  BUTTON_COMBO = "button-combo",
}
export declare enum StockEvent {
  PLAYER_SPAWN = "player-spawn",
  PLAYER_DIED = "player-died",
}
export interface ComboEventFilter {
  playerIndex?: PlayerIndexFilter;
  comboCriteria?: string | Partial<ComboFilterSettings>;
}
export interface GameStartEventFilter {
  isTeams?: boolean;
  numPlayers?: number;
}
export interface GameEndEventFilter {
  winnerPlayerIndex?: PlayerIndexFilter;
  endMethod?: number;
}
export declare type GameEventFilter = GameStartEventFilter | GameEndEventFilter;
export interface InputEventFilter {
  playerIndex?: PlayerIndexFilter;
  combo: string[];
  duration?: number;
}
export interface StockEventFilter {
  playerIndex?: PlayerIndexFilter;
}
export declare type EventFilter = ComboEventFilter | GameEventFilter | InputEventFilter | StockEventFilter;
export interface EventConfig {
  id: string;
  type: string;
  filter?: EventFilter;
}
export declare type EventManagerVariables = Partial<{
  playerIndex: number;
}> &
  Record<string, any>;
export interface EventManagerConfig {
  variables?: EventManagerVariables;
  events: EventConfig[];
}
export interface EventEmit {
  id: string;
  type: string;
  payload?: any;
}
