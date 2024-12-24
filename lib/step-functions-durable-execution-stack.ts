import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {DefinitionBody, StateMachine} from "aws-cdk-lib/aws-stepfunctions";
import {CfnOutput} from "aws-cdk-lib";

export class StepFunctionsDurableExecutionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const inventoryFunction = new NodejsFunction(this, 'InventoryFunction', {
      entry: 'src/inventory-service/inventory.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    })

    const orderFunction = new NodejsFunction(this, 'OrderFunction', {
      entry: 'src/order-service/order.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    })

    const chargeFunction = new NodejsFunction(this, 'ChargeFunction', {
      entry: 'src/charge-service/charge.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    })

    const stateMachine = new StateMachine(this, 'StateMachine', {
      stateMachineName: "DurableExecution",
      definitionBody: DefinitionBody.fromFile("resources/durable-execution.asl.json"),
      definitionSubstitutions: {
        "INVENTORY_FUNCTION_ARN": inventoryFunction.functionArn,
        "ORDER_FUNCTION_ARN": orderFunction.functionArn,
        "CHARGE_FUNCTION_ARN": chargeFunction.functionArn
      }
    })
    inventoryFunction.grantInvoke(stateMachine)
    orderFunction.grantInvoke(stateMachine)
    chargeFunction.grantInvoke(stateMachine)

    new CfnOutput(this, 'stateMachineArn', {
      value: stateMachine.stateMachineArn
    })
  }
}
