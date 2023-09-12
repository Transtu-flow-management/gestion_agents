export interface GPS {
    matricule: string;
    Lat: number;
    Lang: number;
    Alt: number;
    Speed: number;
    Bearing: number;
    Acc: number;
    Addr: string;
    RunningTime: string;
    VersionAndroid: string;
}

export interface gpsData{
    fullData: string;  
    lat :number ;
    lang  :number;
    speed: number; 
}