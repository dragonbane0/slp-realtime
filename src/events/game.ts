import { Observable } from "rxjs";
import { RxSlpStream } from "../stream";
import { withLatestFrom, map, switchMap } from "rxjs/operators";
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
