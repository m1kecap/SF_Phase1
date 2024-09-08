import { Channel } from './channel.model';

export interface Group {
    id: number;
    name: string;
    channels: Channel[];
    admins: number[]; 
    members: number[];
  }
  
