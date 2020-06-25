import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

import {input} from '../../types';

export class KafkaConnector extends k8s.apiextensions.CustomResource {
  constructor(name: string, args: input.kafka.v1alpha1.KafkaConnectorArgs, opts?: pulumi.CustomResourceOptions
  ) {
    const metadata = {...args.metadata, labels: {'strimzi.io/cluster': args.cluster}}
    const resourceArgs: k8s.apiextensions.CustomResourceArgs = {
      apiVersion: "kafka.strimzi.io/v1alpha1",
      kind: "KafkaConnector",
      metadata: metadata,
      spec: args.spec
    };
    super(name, resourceArgs, opts);
  }

}
