import {
    DescribeExecutionCommand,
    DescribeExecutionCommandOutput,
    SFNClient,
    StartExecutionCommand
} from "@aws-sdk/client-sfn";
import {CloudFormationClient, DescribeStacksCommand} from "@aws-sdk/client-cloudformation";

/**
 * If LOCAL_STACK environment variable is set, use LocalStack (IPv4) endpoint, else use default AWS cloud endpoint.
 */
let endPointConfig = process.env['LOCAL_STACK'] ? ({
    endpoint: "http://localhost.localstack.cloud:4566"
}) : {};

/** The Step Functions client to be shared between all tests */
let sfnClient: SFNClient

/** The CloudFormation client (can be reused by multiple tests) */
let cfnClient: CloudFormationClient

/** The final result from a Step Functions execution */
type ExecutionResult = {
    output?: { [key: string]: any },
    error?: string,
    cause?: string
};

/**
 * Return a (reusable) Step Functions AWS SDK client.
 */
export function getStepFunctionsClient() {
    if (!sfnClient) {
        sfnClient = new SFNClient(endPointConfig)
    }
    return sfnClient;
}

/**
 * Pause for a specified number of milliseconds
 */
export async function pause(milliseconds: number) {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve('resolved');
        }, milliseconds);
    });
}

/**
 * Inspect a CloudFormation stack to retrieve the value of a stack output.
 * @param stackName Name of the CloudFormation stack to inspect.
 * @param outputName Name of the output
 * @returns the output's value
 */
export async function getCloudFormationStackOutput(stackName: string, outputName: string): Promise<string> {
    if (!cfnClient) {
        cfnClient = new CloudFormationClient(endPointConfig)
    }
    const response = await cfnClient.send(new DescribeStacksCommand({StackName: stackName}))
    if (!response.Stacks || response.Stacks.length === 0) {
        throw new Error(`CloudFormation stack '${stackName}' not found.`)
    }
    const stack = response.Stacks[0]
    const value = stack.Outputs?.find(output => output.OutputKey === outputName)?.OutputValue
    if (!value) {
        throw new Error(`Output '${outputName}' not found in CloudFormation stack '${stackName}'.`)
    }
    return value
}

/**
 * Given a state machine ARN, execute the state machine with the provided input payload, then wait until the
 * state machine execution terminates. Return the output/error from the execution. This helper is necessary because
 * standard state machines run asynchronously.
 *
 * @param stateMachineArn The ARN of the state machine to execute.
 * @param input Input payload to pass to state machine execution.
 * @returns The state machine's output/error.
 */
export async function runExecutionWithInput(stateMachineArn: string, input: object): Promise<ExecutionResult> {
    const sfnClient = getStepFunctionsClient()

    /* start the state machine running */
    const response = await sfnClient.send(new StartExecutionCommand({
        stateMachineArn: stateMachineArn,
        input: JSON.stringify(input)
    }))
    const executionArn = response.executionArn

    /* periodically poll the execution until it's complete */
    let executionComplete = false
    let describeResponse: DescribeExecutionCommandOutput

    while (!executionComplete) {
        await pause(2000)
        describeResponse = await sfnClient.send(new DescribeExecutionCommand({
            executionArn: executionArn
        }))
        executionComplete = describeResponse.status !== 'RUNNING'
    }

    const finalOutput = describeResponse!
    return {
        output: finalOutput.output ? JSON.parse(finalOutput.output) : undefined,
        error: finalOutput.error,
        cause: finalOutput.cause
    }
}