import { GameStartType, PostFrameUpdateType, StockType, FrameEntryType } from "../types";
import { Observable, OperatorFunction, MonoTypeOperatorFunction } from "rxjs";
/**
 * Filter only the frames where the player has just spawned
 */
export declare function filterJustSpawned(playerIndex: number): MonoTypeOperatorFunction<FrameEntryType>;
/**
 * Filter only the frames where the player has just spawned
 */
export declare function mapFrameToSpawnStockType(
  settings$: Observable<GameStartType>,
  playerIndex: number,
): OperatorFunction<PostFrameUpdateType, StockType>;
export declare function mapFramesToDeathStockType(
  playerSpawned$: Observable<StockType>,
): OperatorFunction<[PostFrameUpdateType, PostFrameUpdateType], StockType>;
