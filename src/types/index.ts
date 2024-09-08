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
    cards: ICard[];
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

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type TInputName = 'email' | 'phone' | 'address';

export interface IAppState{
    payment: 'online' | 'offline';
    email: string;
    phone: string;
    address: string;
    total: number;
    basket: ICard[];
    preview: string | null;
    hasBasket(id: string): boolean;
    addToBasket(id: string): void;
    deleteFromBasket(id: string): void;
    clearBasket(): void;
    getCounter(): number;
    getOrder(): IOrder;
    setOrderField(field: TInputName, value: string, formName: string): void;
    validateOrder(formName: string): boolean
}

export interface IError {
    error: string;
}

export interface IOrderResult {
    id: string;
    total: number;
}

