import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

import {input} from '../../types';

export class Kafka extends k8s.apiextensions.CustomResource {

  constructor(name: string, args: input.kafka.v1beta1.KafkaClusterArgs, opts?: pulumi.CustomResourceOptions
  ) {
    const resourceArgs: k8s.apiextensions.CustomResourceArgs = {
      apiVersion: "kafka.strimzi.io/v1beta1",
      kind: "Kafka",
      ...args
    };
    super(name, resourceArgs, opts);
  }
}
