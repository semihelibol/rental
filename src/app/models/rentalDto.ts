export interface RentalDto{
    id:number;
    carId:number;
    carName:string;
    firstName:string;
    lastName:string;
    companyName:string;
    rentDate:Date;
    returnDate?:Date;
}