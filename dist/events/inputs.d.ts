import type { Observable } from "rxjs";
import type { RxSlpStream } from "../stream";
import type { InputButtonCombo } from "../types";
export declare class InputEvents {
  private stream$;
  constructor(stream: Observable<RxSlpStream>);
  buttonCombo(buttons: string[], duration?: number): Observable<InputButtonCombo>;
  /**
   * Returns an observable which emits when `buttons` is held for `duration` number of frames.
   *
   * @param {number} index The player index
   * @param {number} buttons The button combination
   * @param {number} duration The number of frames the buttons were held for
   * @returns {Observable<number>}
   * @memberof InputEvents
   */
  playerIndexButtonCombo(index: number, buttons: string[], duration?: number): Observable<InputButtonCombo>;
}
