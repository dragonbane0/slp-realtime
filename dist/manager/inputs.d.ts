import type { Observable } from "rxjs";
import type { InputEvents } from "../events/inputs";
import type { EventEmit, EventManagerConfig } from "./types";
export declare const readInputsConfig: (inputs: InputEvents, config: EventManagerConfig) => Observable<EventEmit>;
