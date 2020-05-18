import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export class KafkaOperator extends pulumi.ComponentResource {

  constructor(name: string, args: k8s.helm.v2.ChartOpts | k8s.helm.v2.LocalChartOpts, opts?: pulumi.ComponentResourceOptions) {
    super('cloudstark:k8s:KafkaOperator', name, {}, opts);

    const childOpts = {...opts, parent: this};

    const operatorChart = new k8s.helm.v2.Chart(name, args, childOpts);
  }

}
