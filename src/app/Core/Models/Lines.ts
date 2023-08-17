import { Depot } from "./depot";

export interface Lines{
    id:string;
    nameFr:string;
    nameAr:string;
    start_fr:string;
    start_ar:string;
    end_fr:string;
    end_ar:string;
    warehouse:Depot;
    dateOfInsertion:Date;
    dateOfModification:Date
}


