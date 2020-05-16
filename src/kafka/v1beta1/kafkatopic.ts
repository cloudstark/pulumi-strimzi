import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

import {input} from '../../types';

export class KafkaTopic extends k8s.apiextensions.CustomResource {
  constructor(name: string, args: input.kafka.v1beta1.KafkaTopicArgs, opts?: pulumi.CustomResourceOptions
  ) {
    const metadata = {...args.metadata, labels: {'strimzi.io/cluster': args.cluster}}
    const resourceArgs: k8s.apiextensions.CustomResourceArgs = {
      apiVersion: "kafka.strimzi.io/v1beta1",
      kind: "KafkaTopic",
      metadata: metadata,
      spec: {
        ...args.spec
      }
    };
    super(name, resourceArgs, opts);
  }
}