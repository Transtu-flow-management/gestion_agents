import { Lines } from "./Lines";

export interface Path{
    id:string;
    line:Lines;
    startFr:string;
    startAr:string;
    endFr:string;
    endAr:string;
    type:number;
    data:string;
    dateOfInsertion:Date;
    dateOfModification:Date;

    }