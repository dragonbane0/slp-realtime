import { SlpRealTime } from "../realtime";
import { Observable } from "rxjs";
import { EventManagerConfig, EventEmit } from "./types";
export declare class EventManager {
  realtime: SlpRealTime;
  events$: Observable<EventEmit>;
  private config$;
  constructor(realtime: SlpRealTime);
  updateConfig(config: EventManagerConfig): void;
  private setupSubscriptions;
}
