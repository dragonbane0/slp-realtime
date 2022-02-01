import { ComboEvents, GameEvents, InputEvents, StockEvents } from "../events";
import type { RxSlpStream } from "../stream";
/**
 * SlpRealTime is solely responsible for detecting notable in-game events
 * and emitting an appropriate event.
 *
 * @export
 * @class SlpRealTime
 * @extends {EventEmitter}
 */
export declare class SlpRealTime {
  private stream$;
  game: GameEvents;
  stock: StockEvents;
  input: InputEvents;
  combo: ComboEvents;
  constructor();
  /**
   * Starts listening to the provided stream for Slippi events
   *
   * @param {SlpStream} stream
   * @memberof SlpRealTime
   */
  setStream(stream: RxSlpStream): void;
}
