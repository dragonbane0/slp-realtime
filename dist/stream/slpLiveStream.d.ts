/// <reference types="node" />
import type { Connection, SlpFileWriterOptions } from "@slippi/slippi-js";
import type { WritableOptions } from "stream";
import { RxSlpStream } from "./rxSlpStream";
export { ConnectionEvent, ConnectionStatus, ConsoleConnection } from "@slippi/slippi-js";
/**
 * SlpLiveStream connects to a Wii or Slippi relay and parses all the data
 * and emits SlpStream events.
 *
 * @export
 * @class SlpLiveStream
 * @extends {SlpFileWriter}
 */
export declare class SlpLiveStream extends RxSlpStream {
  /**
   * Connection can be used to return the connection status.
   *
   * @memberof SlpLiveStream
   */
  connection: Connection;
  constructor(connectionType?: "dolphin" | "console", options?: Partial<SlpFileWriterOptions>, opts?: WritableOptions);
  /**
   * Connect to a Wii or Slippi relay on the specified address and port.
   *
   * @param {string} address The address of the Wii or Slippi relay
   * @param {number} port The port of the Wii or Slippi relay
   * @returns {Promise<void>}
   * @memberof SlpLiveStream
   */
  start(address: string, port: number): Promise<void>;
}
