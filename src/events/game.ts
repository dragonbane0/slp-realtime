import type { Observable } from "rxjs";
import { map, switchMap, withLatestFrom } from "rxjs/operators";

import type { RxSlpStream } from "../stream";
import { playerFrameFilter } from "../operators/frames";
import { findWinner } from "../utils";
import { GameStartType, GameEndPayload, FrameEntryType } from "../types";
import { forAllPlayerIndices } from "../utils";

export class GameEvents {
  private stream$: Observable<RxSlpStream>;

  public start$: Observable<GameStartType>;
  public end$: Observable<GameEndPayload>;
  public rawFrames$: Observable<FrameEntryType>;

  public constructor(stream: Observable<RxSlpStream>) {
    this.stream$ = stream;

    this.start$ = this.stream$.pipe(switchMap((s) => s.gameStart$));
    this.end$ = this.stream$.pipe(
      switchMap((s) =>
        s.gameEnd$.pipe(
          withLatestFrom(s.playerFrame$),
          map(([gameEnd, playerFrame]) => ({
            ...gameEnd,
            winnerPlayerIndex: findWinner(playerFrame),
            lastFrame: playerFrame,
          })),
        ),
      ),
    );

    this.rawFrames$ = forAllPlayerIndices((index) => {
      return this.stream$.pipe(
        switchMap((stream) => stream.playerFrame$),
        playerFrameFilter(index), //We only care about certain player frames
      );
    });
  }
}
