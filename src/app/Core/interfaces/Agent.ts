import { Role } from "./Role";

export interface Agent {
    id: number;
    name: string;
    surname: string;
    email: string;
    imageUrl:string;
    username: string;
    roleName: string;
    roles: Role[];
    dateOfInsertion : Date;
    dateOfModification : Date;

    //password: String;
   

}
