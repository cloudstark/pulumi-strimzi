import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

import {input} from '../../types';

export class KafkaConnect extends k8s.apiextensions.CustomResource {
  constructor(name: string, args: input.kafka.v1beta1.KafkaConnectArgs, opts?: pulumi.CustomResourceOptions
  ) {
    const resourceArgs: k8s.apiextensions.CustomResourceArgs = {
      apiVersion: "kafka.strimzi.io/v1beta1",
      kind: "KafkaConnect",
      ...args
    };
    super(name, resourceArgs, opts);
  }

}
