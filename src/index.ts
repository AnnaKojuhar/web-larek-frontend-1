import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { CardBasket, CardCatalog, CardPreview } from './components/card';
import { CardsData } from './components/cardsData';
import { LarekAPI } from './components/LarekApi';
import { Modal } from './components/Modal';
import { AppState } from './components/AppState';
import { Page } from './components/Page';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { IOrder, IPayment, TInputName } from './types';
import { OrderDelivery } from './components/OrderDelivery';
import { OrderUserData } from './components/OrderUserData';
import { Success } from './components/Success';

const event = new EventEmitter
const api = new LarekAPI(API_URL)
const cardData = new CardsData(event)
const appState = new AppState(event, cardData);
const modalElement: HTMLTemplateElement = document.querySelector('#modal-container');
const modal = new Modal(modalElement, event)
const templateCardCatalog: HTMLTemplateElement = document.querySelector('#card-catalog');
const templateCardPreview: HTMLTemplateElement = document.querySelector('#card-preview');
const page = new Page(document.querySelector('.page'), event)
const cardPreviewElement = new CardPreview(cloneTemplate(templateCardPreview), event, {onClick: () => event.emit('basket:add/remove', {cardId: appState.preview})});
const basket = new Basket(cloneTemplate('#basket'), event);
basket.render({selected: appState.total})
const orderDelivery = new OrderDelivery(cloneTemplate('#orderDelivery'), event);
const orderUserData = new OrderUserData(cloneTemplate('#orderUserData'), event)

event.onAll((event) => {
    console.log(event.eventName, event.data)
});

event.on('modal:open', () => {
    page.locked = true;
});

event.on('modal:close', () => {
    page.locked = false;
});

event.on('Cards:changed', () => {
    const cardsList = cardData.cards.map((card) => new CardCatalog(cloneTemplate(templateCardCatalog), event, {onClick: () => event.emit('preview:open', {cardId: card.id})}).render(card));
    page.render({ catalog: cardsList});
})

event.on('preview:open', (data: { cardId: string }) => {
    appState.preview = data.cardId;
})

event.on('card:selected', () => {
    const cardId = appState.preview;
    cardPreviewElement.setButtonText(appState.hasBasket(cardId));
    modal.render({content: cardPreviewElement.render(cardData.getCard(cardId))})
})

event.on('basket:add/remove',(data: { cardId: string }) => {
    if(appState.hasBasket(data.cardId)) {
        appState.deleteFromBasket(data.cardId);
        cardPreviewElement.setButtonText(false);
    } else {
        appState.addToBasket(data.cardId);
        cardPreviewElement.setButtonText(true);
    }
})

event.on('basket:changed', () => {
    page.render({counter: appState.getCounter()});
    const basketCardsList = appState.basket.map((card, index) => {
        const cardBasket = new CardBasket(cloneTemplate('#card-basket'), event, {onClick: () => event.emit('basket:add/remove', {cardId: card.id})})
        cardBasket.itemIndex = index + 1;
        return cardBasket.render(card);
    })
    basket.render({total: appState.total, items: basketCardsList, selected: appState.total})
})

event.on('basket:open', () => {
   modal.render({content: basket.render()})
})

// Изменилось состояние валидации формы
event.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone, address } = errors;
    orderDelivery.valid = !address;
    orderDelivery.errors = Object.values({address}).filter(i => !!i).join('; ');
    orderUserData.valid = !email && !phone;
    orderUserData.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
event.on(/^order\w*\..*:change/, (data: { field: TInputName, value: string, formName: string}) => {
    appState.setOrderField(data.field, data.value, data.formName);
});

event.on('order:open', () => {
    modal.render({
        content: orderDelivery.render({
            address: '',
            buttonPayment: appState.payment,
            valid: false,
            errors: []
        })
    });
});

event.on('payment:change', (data: {buttonName: IPayment}) => {
    switch (data.buttonName) {
        case('online'):
            appState.payment = 'online';
            break;
        case('offline'):
            appState.payment = 'offline';
            break;
        default:
            console.error('Ошибка в вариантах оплаты')
    }
    orderDelivery.buttonPayment = appState.payment;
})

event.on('orderDelivery:submit', () => {
    modal.render({
        content: orderUserData.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
})

event.on('orderUserData:submit', () => {
    api.order(appState.getOrder())
    .then(() => {
        const success = new Success(cloneTemplate('#success'), {
            onClick: () => {
                modal.close();
            }
        });
        modal.render({
            content: success.render({total: appState.total})
        });
        appState.cleanBasket();
        appState.cleanOrderData();
    })
    .catch(err => {
        console.error(err);
    });
})

api.getCardsList()
    .then((data) => {
        cardData.cards = data;
    })
    .catch((err) => {
        console.error(err);
});