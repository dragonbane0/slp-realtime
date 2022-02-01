import { RxSlpStream } from "../stream";
import { Observable } from "rxjs";
import { StockType, PercentChange, StockCountChange } from "../types";
export declare class StockEvents {
  private stream$;
  playerSpawn$: Observable<StockType>;
  playerDied$: Observable<StockType>;
  percentChange$: Observable<PercentChange>;
  countChange$: Observable<StockCountChange>;
  constructor(stream: Observable<RxSlpStream>);
  /**
   * Emits an event each time player spawns.
   */
  playerIndexSpawn(index: number): Observable<StockType>;
  /**
   * Emits an event each time player dies.
   */
  playerIndexDied(index: number): Observable<StockType>;
  playerIndexPercentChange(index: number): Observable<PercentChange>;
  playerIndexStockCountChange(index: number): Observable<StockCountChange>;
}
