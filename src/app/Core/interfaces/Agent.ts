import { Role } from "./Role";

export interface Agent {
    id: number;
    name: string;
    surname: string;
    imageUrl:string;
    username: string;
    roleName: string;
    address:string;
    DateOfBirth:Date;
    phone:string;
    roles: Role[];
    dateOfInsertion : Date;
    dateOfModification : Date;

    //password: String;
   

}
