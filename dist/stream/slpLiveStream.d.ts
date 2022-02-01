import { RxSlpStream } from "./rxSlpStream";
import { Connection } from "@slippi/slippi-js";
export { ConnectionEvent, ConsoleConnection, ConnectionStatus } from "@slippi/slippi-js";
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
  constructor(connectionType?: "dolphin" | "console");
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
