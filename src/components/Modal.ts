import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
        this.handleEscUp = this.handleEscUp.bind(this);
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        document.addEventListener("keyup", this.handleEscUp);
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        document.removeEventListener("keyup", this.handleEscUp);
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
          this.close();
        }
      };

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}