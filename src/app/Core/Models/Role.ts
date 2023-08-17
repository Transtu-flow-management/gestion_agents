export interface Role{
    id:number;
    roleName: string;
    dateOfCreation : Date;
    dateOfModification :Date;
    containsPermissions: boolean;
    permissions:IPermissions[];
   
}

export interface IPermissions {
    permissionName : string;
    group :string;
    selected: boolean;
    TYPE: string;
}

