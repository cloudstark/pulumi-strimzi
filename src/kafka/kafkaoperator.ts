import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

import {input} from '../types';

export class KafkaOperator extends pulumi.ComponentResource {

  constructor(name: string, args: input.kafka.KafkaOperatorArgs, opts?: pulumi.ComponentResourceOptions) {
    super('cloudstark:k8s:KafkaOperator', name, {}, opts);

    const childOpts = {...opts, parent: this};

    const operatorChart = new k8s.helm.v2.Chart(name, {
      repo: args.repo,
      chart: args.chart,
      version: args.version,
      namespace: args.namespace,
      values: args.values
    }, childOpts);

  }

}
