export interface Move {
  id: number;
  name: string;
  shortName: string;
}
export declare const UnknownMove: Move;
export declare enum MoveID {
  MISC = 1,
  JAB_1 = 2,
  JAB_2 = 3,
  JAB_3 = 4,
  RAPID_JABS = 5,
  DASH_ATTACK = 6,
  F_TILT = 7,
  U_TILT = 8,
  D_TILT = 9,
  F_SMASH = 10,
  U_SMASH = 11,
  D_SMASH = 12,
  NEUTRAL_AIR = 13,
  F_AIR = 14,
  B_AIR = 15,
  U_AIR = 16,
  D_AIR = 17,
  NEUTRAL_SPECIAL = 18,
  F_SPECIAL = 19,
  U_SPECIAL = 20,
  D_SPECIAL = 21,
  GETUP = 50,
  GETUP_SLOW = 51,
  GRAB_PUMMEL = 52,
  F_THROW = 53,
  B_THROW = 54,
  U_THROW = 55,
  D_THROW = 56,
  EDGE_SLOW = 61,
  EDGE = 62,
}
export declare function getMoveInfo(moveId: number): Move;
export declare function getMoveShortName(moveId: number): string;
export declare function getMoveName(moveId: number): string;
