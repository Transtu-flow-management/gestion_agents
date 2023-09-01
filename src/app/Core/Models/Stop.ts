import { Path } from "./Path";

export interface Stop{
   id:string;
   name_fr:string;
   name_ar:string;
   lat:number;
   lng:number;
   stopnumber:number;
   path:Path;
   description:string;
   dateOfInsertion:Date;
   dateOfModification:Date;

}