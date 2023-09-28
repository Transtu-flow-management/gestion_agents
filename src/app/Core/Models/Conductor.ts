import { Depot } from "./depot";

export interface Conductor{
    id:number;
    name:string;
    surname:string;
    uid :string;
    type:number;
    warehouse:Depot;
    dateOfInsertion: Date;
    dateOfModification: Date;
}