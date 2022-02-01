import { Observable } from "rxjs";
import { EventEmit, EventManagerConfig } from "./types";
import { StockEvents } from "../events/stocks";
export declare const readStocksConfig: (stocks: StockEvents, config: EventManagerConfig) => Observable<EventEmit>;
