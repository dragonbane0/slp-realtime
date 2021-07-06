import { EventManagerVariables } from "../manager";
import { MonoTypeOperatorFunction } from "rxjs";
import { PlayerIndexFilter } from "../types";
export declare function playerFilter<
  T extends {
    playerIndex: number;
  }
>(indices: PlayerIndexFilter, variables?: EventManagerVariables): MonoTypeOperatorFunction<T>;
export declare const playerFilterMatches: (
  playerIndex: number,
  indices: PlayerIndexFilter,
  variables?: EventManagerVariables,
) => boolean;
