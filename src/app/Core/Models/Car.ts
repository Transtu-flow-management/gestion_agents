import { Conductor } from "./Conductor";
import { Lines } from "./Lines";
import { Path } from "./Path";
import { Brand } from "./brand";
import { Condition } from "./condition";
import { Depot } from "./depot";

export interface Car {

    id:string;
    matricule:string;
    selectedNetwork:string;
    line:Lines;
    path:Path;
    driver:Conductor;
    brand:Brand;
    mode:number;
    warehouse:Depot;
    stopcount:number;
    state:Condition;
    dateOfInsertion:Date;
    dateOfModification:Date;
}