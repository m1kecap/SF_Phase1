import { Channel } from "diagnostics_channel";
import { Group } from "./group.model";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    roles: string[];
    groups?: Group[];
    channels?: Channel[];
  }
  