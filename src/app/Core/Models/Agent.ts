import { Role } from "./Role";
import { Depot } from "./depot";

export interface Agent {
    id: number;
    name: string;
    surname: string;
    imageUrl:string;
    password:string;
    username: string;
    roleName: string;
    address:string;
    DateOfBirth:Date;
    phone:string;
    roles: Role[];
    warehouse:Depot[];
    warehouseName :string;
    dateOfInsertion : Date;
    dateOfModification : Date;

    //password: String;
   

}
