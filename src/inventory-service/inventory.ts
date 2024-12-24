import { Context, Handler } from 'aws-lambda';
import {authorize} from '../shared/authorizer'

export type InventoryRequest = {
    /** unique value identifying the current transaction (may involve multiple requests) */
    transactionId: string,

    /** ID of the inventory item we are processing */
    itemId: string,

    /** Status of this item in the inventory */
    newStatus: 'AVAILABLE' | 'PENDING' | 'SOLD'

    /** Unique ID for this request (to ignore duplicate requests) */
    idempotencyKey: string,
}

export type InventoryResponse = {
    /** Whether this request succeeded or failed */
    status: 'OK' | 'FAILED'
}

/**
 * Handler for requests related to inventory.
 */
export const handler: Handler = async (event: InventoryRequest, context: Context): Promise<InventoryResponse> => {
    console.log("Inventory request: " + JSON.stringify(event, null, 2))
    authorize()

    // TODO: implement this code properly. For now it uses hard-coded values.

    /* there are no shoes in the inventory */
    if (event.newStatus === 'PENDING' && event.itemId === 'shoes') {
        return {
            status: 'FAILED'
        }
    }

    return {
        status: 'OK'
    }
};