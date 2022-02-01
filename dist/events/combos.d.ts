import type { Observable } from "rxjs";
import type { RxSlpStream } from "../stream";
import type { ComboEventPayload } from "../types";
export declare class ComboEvents {
  private stream$;
  private comboComputer;
  start$: Observable<ComboEventPayload>;
  extend$: Observable<ComboEventPayload>;
  end$: Observable<ComboEventPayload>;
  conversion$: Observable<ComboEventPayload>;
  constructor(stream: Observable<RxSlpStream>);
}
