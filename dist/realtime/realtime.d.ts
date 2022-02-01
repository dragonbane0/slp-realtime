import { RxSlpStream } from "../stream";
import { StockEvents, InputEvents, ComboEvents, GameEvents } from "../events";
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
