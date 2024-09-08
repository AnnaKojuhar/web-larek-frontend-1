import { Form } from './Form';
import { IPayment, TOrderDelivery } from "../types";
import { IEvents } from "./base/events";

export class OrderDelivery extends Form<TOrderDelivery & {buttonPayment: IPayment}> {
    protected buttons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this.buttons = container.querySelectorAll('.button_alt');

        this.buttons.forEach((button) => {
            button.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLButtonElement;
                this.events.emit(`payment:change`, {
                    buttonName: target.name
                });
            })
        })
    }

    set buttonPayment(payment: IPayment) {
         this.buttons.forEach((button) => {
            if(button.name == payment) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
         })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}