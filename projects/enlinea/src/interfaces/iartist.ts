import { IBase } from "./ibase";

export interface IArtist extends IBase {
    name: string;
    members: string[];
}
