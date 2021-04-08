export interface UserModel{
    id:number;
    firstName:string;
    lastName:string;
    email:string;
    status:boolean;
    passwordHash?:number;
    passwordSalt?:number;
}