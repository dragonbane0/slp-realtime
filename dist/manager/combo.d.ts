import type { Observable } from "rxjs";
import type { ComboEvents } from "../events/combos";
import type { EventEmit, EventManagerConfig } from "./types";
export declare const readComboConfig: (combo: ComboEvents, config: EventManagerConfig) => Observable<EventEmit>;
