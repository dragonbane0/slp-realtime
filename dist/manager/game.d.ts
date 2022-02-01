import { Observable } from "rxjs";
import { EventEmit, EventManagerConfig } from "./types";
import { GameEvents } from "../events";
export declare const readGameConfig: (game: GameEvents, config: EventManagerConfig) => Observable<EventEmit>;
