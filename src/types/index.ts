import { IEvents } from "../components/base/events";

export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export type TCardMain = Omit<ICard, 'description'>;

export type TCardBasket = Pick<ICard, 'id' | 'title' | 'price'>;


export interface ICardsData {
    items: ICard[];
    preview: string | null;
    events: IEvents;
    getCard(cardId: string): ICard
}

export type IPayment = 'online' | 'offline';

export interface IOrder {
    payment: IPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export type TOrderDelivery = Pick<IOrder, 'payment' | 'address'>;

export type TOrderUserData = Pick<IOrder, 'email' | 'phone'>;

export type TBasket = Pick<IOrder, 'total' | 'items'>

export interface IOrderData{
    getOrder(): IOrder; 
    setOrderDelivery(OrderDelivery: TOrderDelivery): void;
    setOrderUserData(OrderUserData: TOrderUserData): void;
    hasBasket(id: string): boolean;
    addCard(id: string): void;
    deleteCard(id: string): void;
    clearBasket(): void;
    getBasket(): TBasket;
    checkDeliveryValidation(data: Record<keyof TOrderDelivery, string>): boolean;
    checkUserDataValidation(data: Record<keyof TOrderUserData, string>): boolean;
    checkAddress(value: string): boolean;
    checkEmail(value: string) : boolean;
    checkPhone(value: string): boolean;
}

export interface IError {
    error: string;
}

export interface IOrderResult {
    id: string;
    total: number;
}

