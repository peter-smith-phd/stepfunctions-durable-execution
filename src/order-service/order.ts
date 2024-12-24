import { Context, Handler } from 'aws-lambda';
import {authorize} from "../shared/authorizer";

export type OrderRequest = {
    /** unique value identifying the current transaction (may involve multiple requests) */
    transactionId: string,

    /** ID of the inventory item we are ordering */
    itemId: string,

    /** Unique ID of the customer the order is for */
    customerId: number,

    /** Unique ID for this request (to ignore duplicate requests) */
    idempotencyKey: string,
}

export type OrderResponse = {
    /** Whether this request succeeded or failed */
    status: 'SHIPPED' | 'NOT_SHIPPED'
}

/**
 * Handler for requests related to orders.
 */
export const handler: Handler = async (event: OrderRequest, context: Context): Promise<OrderResponse> => {
    authorize()

    // TODO: implement this code

    return {
        status: 'SHIPPED'
    }
};