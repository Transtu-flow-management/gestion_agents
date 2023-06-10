export interface Role{
    id:Number;
    roleName: String;
    dateOfCreation : Date;
    dateOfModification :Date;
    permissions:String[];

}

export interface IPermissions {
    permissionName : String;
    selected: boolean;
    TYPE: String;
}

