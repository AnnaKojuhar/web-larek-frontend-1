import { Form } from './Form';
import { TOrderUserData } from "../types";
import { IEvents } from "./base/events";

export class OrderUserData extends Form<TOrderUserData> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}