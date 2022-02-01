import type { FrameEntryType } from "../types";
/**
 * Given the last frame of the game, determine the winner first based on stock count
 * then based on remaining percent.
 * If percents are tied, return the player with the lower port number by default.
 *
 * @returns the player index of the winner
 */
export declare const findWinner: (lastFrame: FrameEntryType) => number;
