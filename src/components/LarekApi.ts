import { ICard, IOrder, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface ILarekAPI {
    getCardsList: () => Promise<ICard[]>;
    getCard: (id: string) => Promise<ICard>;
    order: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {

    getCard(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then(
            (item: ICard) => item
        );
    }

    getCardsList(): Promise<ICard[]> {
        return this.get('/product').then(
            (data: ApiListResponse<ICard>) => {
            return data.items
        }
        );
    }

    order(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}