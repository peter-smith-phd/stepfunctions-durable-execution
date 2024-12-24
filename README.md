# Example of Developing with Step Functions, Lambda, CDK, and LocalStack

This example project demonstrates how a TypeScript developer can write an AWS
Step Functions workflow that invokes Lambda functions. It uses a combination of
TypeScript, CDK, Workflow Studio (part of the AWS Step Functions service), and
LocalStack for testing.

To deploy this example via the AWS Cloud:

```
$ npm install
$ cdk deploy
$ npm test
```

To deploy this via LocalStack:

```
$ npm install
$ cdklocal bootstrap # assuming you just booted LocalStack
$ cdklocal deploy
$ LOCAL_STACK=1 npm test
```


