import { Role } from "./Role";

export interface Agent {
    id: Number;
    name: String;
    prenom: String;
    email: String;
    imageUrl:String;
    username: String;
    roleName: String;
    roles: String[];
    dateOfInsertion : Date;
    dateOfModification : Date;
    totalPages:number;
    totalElements:number;
    //password: String;
   

}
