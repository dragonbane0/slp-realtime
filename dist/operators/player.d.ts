import type { MonoTypeOperatorFunction } from "rxjs";
import type { EventManagerVariables } from "../manager";
import type { PlayerIndexFilter } from "../types";
export declare function playerFilter<
  T extends {
    playerIndex: number;
  }
>(indices: PlayerIndexFilter, variables?: EventManagerVariables): MonoTypeOperatorFunction<T>;
export declare const playerFilterMatches: (
  playerIndex: number,
  indices: PlayerIndexFilter,
  variables?: EventManagerVariables | undefined,
) => boolean;
