#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StepFunctionsDurableExecutionStack } from '../lib/step-functions-durable-execution-stack';

const app = new cdk.App();
new StepFunctionsDurableExecutionStack(app, 'StepFunctionsDurableExecutionStack', {});