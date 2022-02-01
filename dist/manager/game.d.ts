import type { Observable } from "rxjs";
import type { GameEvents } from "../events";
import type { EventEmit, EventManagerConfig } from "./types";
export declare const readGameConfig: (game: GameEvents, config: EventManagerConfig) => Observable<EventEmit>;
