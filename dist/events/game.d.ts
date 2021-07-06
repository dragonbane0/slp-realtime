import { Observable } from "rxjs";
import { RxSlpStream } from "../stream";
import { GameStartType, GameEndPayload, FrameEntryType } from "../types";
export declare class GameEvents {
  private stream$;
  start$: Observable<GameStartType>;
  end$: Observable<GameEndPayload>;
  rawFrames$: Observable<FrameEntryType>;
  constructor(stream: Observable<RxSlpStream>);
}
