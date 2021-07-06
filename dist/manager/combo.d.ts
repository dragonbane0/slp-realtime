import { Observable } from "rxjs";
import { EventEmit, EventManagerConfig } from "./types";
import { ComboEvents } from "../events/combos";
export declare const readComboConfig: (combo: ComboEvents, config: EventManagerConfig) => Observable<EventEmit>;
