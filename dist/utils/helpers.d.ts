/// <reference types="node" />
import { Observable } from "rxjs";
import { Writable } from "stream";
export declare const forAllPlayerIndices: <T>(func: (index: number) => Observable<T>) => Observable<T>;
export declare const pipeFileContents: (filename: string, destination: Writable, options?: any) => Promise<void>;
