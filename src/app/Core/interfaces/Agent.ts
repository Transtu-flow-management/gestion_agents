import { Role } from "./Role";

export interface Agent {
    id: Number;
    name: String;
    prenom: String;
    email: String;
    imageUrl:String;
    username: String;
    roleName: String;
    roles: Role[];
    dateOfInsertion : Date;
    dateOfModification : Date;

    //password: String;
   

}
