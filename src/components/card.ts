import { ICard } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected event: IEvents
    protected _id: string;
    protected _button: HTMLButtonElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _itemIndex: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions){
        super(container);
        this.event = events;
        this._button = container.querySelector('.card__button');
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._itemIndex = container.querySelector('.basket__item-index');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._description = container.querySelector('.card__text');

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

    set itemIndex(value: number) {
        this.setText(this._itemIndex, value);
    }

    set category(value: string) {
        this.setText(this._category, value);
        if(this._category) {
            this._category.className = '';
            let categoryColorStyle = 'card__category_'
            switch(value){
                case('софт-скил'):
                    categoryColorStyle += 'soft';
                    break;
                case('хард-скил'):
                    categoryColorStyle += 'hard';
                    break;
                case('другое'):
                    categoryColorStyle += 'other';
                    break;
                case('дополнительное'):
                    categoryColorStyle += 'additional';
                    break;
                case('кнопка'):
                    categoryColorStyle += 'button';
                    break;
                default:
                    console.error('Нет стилей для данной категории');
                    categoryColorStyle += 'soft';
                    break;
            }
            this._category.classList.add('card__category', categoryColorStyle);
        }
    }
    
    set image(value: string) {
        this.setImage(this._image, CDN_URL+value, this.title);
    }

    set description
    (value: string) {
        this.setText(this._description, value);
    }

    setButtonText(value: boolean): void {
        this._button.textContent = value ? 'В корзине' : 'Купить';
    }
}