export interface Depot{
    id:Number,
    name:String,
    longitude:number;
    lattitude: number;
    capacite: number;
    locationName:String;
    Reseaux : String[];
    selectedReseau:string;
    adresse: String;
    dateOfInsertion: Date;
    dateOfModification: Date;

}