import type { Observable } from "rxjs";
import type { StockEvents } from "../events/stocks";
import type { EventEmit, EventManagerConfig } from "./types";
export declare const readStocksConfig: (stocks: StockEvents, config: EventManagerConfig) => Observable<EventEmit>;
