import { Role } from "./Role";

export interface Agent {
    id: Number;
    name: String;
    prenom: String;
    email: String;
    username: String;
    roleName: String;
    dateOfInsertion : Date;
    dateOfModification : Date;
    //password: String;
   

}
