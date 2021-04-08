import { CreditCard } from "./creditCard";

export interface PayByCreditCardDto{
    id?:number;
    customerId:number;
    creditCard:CreditCard;
    paymentDate:Date;
    paymentAmount:number;
}