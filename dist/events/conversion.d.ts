import type { ConversionType, GameStartType } from "@slippi/slippi-js";
import type { Observable } from "rxjs";
import type { RxSlpStream } from "../stream";
interface ConversionEventPayload {
  combo: ConversionType;
  settings: GameStartType;
}
export declare class ConversionEvents {
  private stream$;
  private conversionComputer;
  end$: Observable<ConversionEventPayload>;
  constructor(stream: Observable<RxSlpStream>);
}
export {};
