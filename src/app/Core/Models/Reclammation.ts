import { Car } from "./Car";

export interface Reclammation{
    id:string;
    car : Car;
    type:number;
    predifinedContext:string;
    context:string;
    TimeOfIncident :string;
    DateOfCreation:Date;
    email:string;
}