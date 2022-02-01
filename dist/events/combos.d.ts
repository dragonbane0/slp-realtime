import { ComboEventPayload } from "../types";
import { Observable } from "rxjs";
import { RxSlpStream } from "../stream";
export declare class ComboEvents {
  private stream$;
  private settings;
  private playerPermutations;
  private state;
  private combos;
  private comboStartSource;
  private comboExtendSource;
  private comboEndSource;
  start$: Observable<ComboEventPayload>;
  extend$: Observable<ComboEventPayload>;
  end$: Observable<ComboEventPayload>;
  conversion$: Observable<ComboEventPayload>;
  private resetState;
  constructor(stream: Observable<RxSlpStream>);
  private setPlayerPermutations;
  private processFrame;
}
