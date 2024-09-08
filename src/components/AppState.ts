import { ICard, ICardsData, IOrder, IAppState, FormErrors, TInputName, IPayment } from "../types";
import { IEvents } from "./base/events";


export class AppState implements IAppState {
    protected events: IEvents;
    protected catalog: ICardsData;
    protected _preview: string | null;

    protected _payment: IPayment = 'online';
    protected _email: string;
    protected _phone: string;
    protected _address: string;
    protected _totalBasket: number;
    protected _basket: ICard[] = [];
    protected formErrors: FormErrors = {};

    constructor(events: IEvents , catalog: ICardsData) {
        this.events = events;
        this.catalog = catalog;
        this._totalBasket = 0;
    }

    set payment(value: 'online' | 'offline') {
        this._payment = value;
    }

    get payment(): 'online' | 'offline' {
        return this._payment;
    }

    set email(value: string) {
        this._email = value;
    }

    get email(): string {
        return this._email
    }
    
    set phone(value: string) {
        this._phone = value;
    }

    get phone(): string {
        return this._phone;
    }

    set address(value: string) {
        this._address = value;
    }

    get address(): string {
        return this._address;
    }

    get total(): number {
        return this._totalBasket;
    }

    get basket(): ICard[] {
        return this._basket;
    }

    set preview(cardId: string | null) {
        if(!cardId) {
            this._preview = null;
        }
        const selectedCard = this.catalog.getCard(cardId);
        if (selectedCard) {
            this._preview = cardId;
            this.events.emit('card:selected')
        }
    }

    get preview(): string | null{
        return this._preview
    }

    hasBasket(id: string): boolean {
        return this._basket.some((cardBasket) => cardBasket.id === id)
    }

    addToBasket(id: string): void {
        const card = this.catalog.getCard(id);
        this._basket.push(card);
        this._totalBasket += card.price;
        this.events.emit('basket:changed');
    }

    deleteFromBasket(id: string): void {
        const card = this.catalog.getCard(id);
        this._basket = this._basket.filter(cardBasket => cardBasket.id !== card.id);
        this._totalBasket -= card.price;
        this.events.emit('basket:changed');
    }

    clearBasket(): void {
        this._basket = [];
        this._totalBasket = 0;
        this.events.emit('basket:changed');
    }

    getCounter(): number {
        return this._basket.length
    }

    getOrder(): IOrder{
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
            items: this.basket.filter((itemData) => {return itemData.price}).map((card) => {return card.id})
        }
    }

    setOrderField(field: TInputName, value: string, formName: string) {
        this[field] = value;

        if (this.validateOrder(formName)) {
            this.events.emit(`${formName}:valid`);
        }
    }

    validateOrder(formName: string) {
        const errors: typeof this.formErrors = {};
        switch(formName) {
            case 'orderDelivery':
                if (!this.address) {
                    errors.address = 'Необходимо указать адрес';
                }
                break
            case 'orderUserData':
                if (!this.email) {
                    errors.email = 'Необходимо указать почту';
                }
                if (!this.phone) {
                    errors.phone = 'Необходимо указать телефон';
                }
                break
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    clearOrderData(): void{
        this.phone = '';
        this.email = '';
        this.address = '';
    }
}