import { ICard } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

abstract class Card extends Component<ICard> {
    protected event: IEvents
    protected _id: string;
    protected _button: HTMLButtonElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions){
        super(container);
        this.event = events;
        this._button = container.querySelector('.card__button');
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this._id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: number) {
        this.setText(this._price, value || 'Бесценно');
    }
}

export class CardBasket extends Card {
    protected _itemIndex: HTMLElement;
    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions){
        super(container, events, actions)
        this._itemIndex = ensureElement<HTMLElement>('.basket__item-index', container);
    }
    set itemIndex(value: number) {
        this.setText(this._itemIndex, value);
    }
}

export class CardCatalog extends Card {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions){
        super(container, events, actions)
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
    }
    set category(value: string) {
        this.setText(this._category, value);
    }
    set image(value: string) {
        this.setImage(this._image, CDN_URL+value, this.title)
    }
}

export class CardPreview extends CardCatalog {
    protected _text: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions){
        super(container, events, actions)
        this._text = ensureElement<HTMLImageElement>('.card__text', container);
    }

    set text(value: string) {
        this.setText(this._text, value);
    }

    setButtonText(value: boolean): void {
        this._button.textContent = value ? 'В корзине' : 'Купить';
    }
}