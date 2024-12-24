import { Context, Handler } from 'aws-lambda';
import {authorize} from "../shared/authorizer";

export type ChargeRequest = {
    /** unique value identifying the current transaction (may involve multiple requests) */
    transactionId: string,

    /** The amount of money to charge */
    cost: number,

    /** ID of the customer we are charging */
    customerId: string,

    /** Unique ID for this request (to ignore duplicate requests) */
    idempotencyKey: string,
}

export type ChargeResponse = {
    /** Whether this request succeeded or failed */
    status: 'OK' | 'FAILED'
}

/**
 * Handler for requests related to charges.
 */
export const handler: Handler = async (event: ChargeRequest, context: Context): Promise<ChargeResponse> => {
    authorize()

    // TODO: implement this code properly. For now it is only mocked data.

    if (event.customerId === 'John' && event.cost > 10) {
        return {
            status: 'FAILED'
        }
    } else {
        return {
            status: 'OK'
        }
    }
};