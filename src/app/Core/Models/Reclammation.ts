import { Car } from "./Car";

export interface Reclammation{
    id:string;
    car : string;
    type:number;
    predifinedContext:string;
    context:string;
    timeOfIncident :string;
    DateOfCreation:Date;
    email:string;
}