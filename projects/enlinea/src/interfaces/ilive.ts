import { IBase } from "./ibase";
import { ITrack } from "./itrack";

export interface ILive extends IBase {
    schedule: Date,
    track: ITrack
}