import { Observable, MonoTypeOperatorFunction } from "rxjs";
/**
 * Return the previous frame of the game and the current frame
 */
export declare function pausable<T>(stop: Observable<any>, restart: Observable<any>): MonoTypeOperatorFunction<T>;
