import { PlayerIndexedType } from "@slippi/slippi-js";
import { ConversionType, FrameEntryType, GameStartType } from "../types";
import { Observable } from "rxjs";
import { RxSlpStream } from "../stream";
interface ConversionEventPayload {
  combo: ConversionType;
  settings: GameStartType;
}
export declare class ConversionEvents {
  private stream$;
  private settings;
  private playerPermutations;
  private conversions;
  private state;
  private conversionSource;
  end$: Observable<ConversionEventPayload>;
  private resetState;
  constructor(stream: Observable<RxSlpStream>);
  setPlayerPermutations(playerPermutations: PlayerIndexedType[]): void;
  processFrame(prevFrame: FrameEntryType, latestFrame: FrameEntryType): void;
}
export {};
