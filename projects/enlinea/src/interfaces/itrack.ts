import { IBase } from "./ibase";

export interface ITrack extends IBase {
    name: string;
    artists: string[];
}
