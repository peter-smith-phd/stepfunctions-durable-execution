import {randomUUID} from "node:crypto";
import {getCloudFormationStackOutput, runExecutionWithInput} from "./test-utils";

let stateMachineArn: string

beforeAll(async () => {
    stateMachineArn = await getCloudFormationStackOutput("StepFunctionsDurableExecutionStack", "stateMachineArn")
})

test('Item "shoes" is unavailable', async () => {
    const output = await runExecutionWithInput(stateMachineArn, {
        transactionId: randomUUID(),
        itemId: "shoes",
        customerId: "Bob",
        cost: 12.34
    })
    expect(output.output).toBeUndefined()
    expect(output.error).toBe("OutOfStock")
    expect(output.cause).toBe("This item is no longer in stock")
});

test('Customer "John" has insufficient funds', async () => {
    const output = await runExecutionWithInput(stateMachineArn, {
        transactionId: randomUUID(),
        itemId: "jacket",
        customerId: "John",
        cost: 12.34
    })
    expect(output.output).toBeUndefined()
    expect(output.error).toBe("ChargeFailed")
    expect(output.cause).toBe("We were not able to charge your credit card")
})

test('Successful purchase', async () => {
    const output = await runExecutionWithInput(stateMachineArn, {
        transactionId: randomUUID(),
        itemId: "toothbrush",
        customerId: "John",
        cost: 8
    })
    expect(output.output!['status']).toBe("COMPLETE")
})



