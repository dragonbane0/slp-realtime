import type { Observable } from "rxjs";
import type { SlpRealTime } from "../realtime";
import type { EventEmit, EventManagerConfig } from "./types";
export declare class EventManager {
  realtime: SlpRealTime;
  events$: Observable<EventEmit>;
  private config$;
  constructor(realtime: SlpRealTime);
  updateConfig(config: EventManagerConfig): void;
  private setupSubscriptions;
}
