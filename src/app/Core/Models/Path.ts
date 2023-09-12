import { Lines } from "./Lines";
import { Stop } from "./Stop";

export interface Path{
    id:string;
    line:Lines;
    startFr:string;
    startAr:string;
    endFr:string;
    endAr:string;
    type:number;
    data:string;
    stops:Stop[];
    dateOfInsertion:Date;
    dateOfModification:Date;
    }