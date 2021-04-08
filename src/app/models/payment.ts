export interface Payment{
    id?:number;
    customerId:number;
    creditCardId?:number;
    paymentDate:Date;
    paymentAmount:number;
}