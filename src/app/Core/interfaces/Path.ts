import { Lines } from "./Lines";

export interface Path{
    id:string;
    line:Lines;
    nameFr:string;
    nameAr:string;
    type:number;
    dateOfInsertion:Date;
    dateOfModification:Date;

}