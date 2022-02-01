import { Observable } from "rxjs";
import { EventEmit, EventManagerConfig } from "./types";
import { InputEvents } from "../events/inputs";
export declare const readInputsConfig: (inputs: InputEvents, config: EventManagerConfig) => Observable<EventEmit>;
