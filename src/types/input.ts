import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export namespace kafka {

  export interface HelmOptions {
    repo: pulumi.Input<string>;
    chart: pulumi.Input<string>;
    version: pulumi.Input<string>;
    namespace?: pulumi.Input<string>;
    values?: pulumi.Input<any>;
  }

  // export const defaults = (args: KafkaOperatorArgs): KafkaOperatorArgs => {
  //   args.repo = "strimzi";
  //   args.chart = "strimzi-kafka-operator";
  //   args.version = "0.17.0";
  //   return args;
  // }

  export interface KafkaOperatorArgs extends HelmOptions {
  }

  export namespace v1beta1 {

    export interface KafkaClusterArgs {
      metadata?: k8s.apiextensions.CustomResourceArgs['metadata'];
      spec: pulumi.Input<ClusterArgs>;
    }

    export interface ClusterArgs {
      /**
       * Configuration of the Kafka cluster.
       */
      kafka: pulumi.Input<KafkaArgs>
      /**
       * Configuration of the ZooKeeper cluster.
       */
      zookeeper: pulumi.Input<ZookeeperArgs>
      /**
       * Configuration of the Entity Operator
       */
      entityOperator?: pulumi.Input<EntityOperator>;
    }

    export interface KafkaArgs {
      /**
       * The number of pods in the cluster.
       */
      replicas: pulumi.Input<number>;
      /**
       * The docker image for the pods. The default value depends
       * on the configured `Kafka.spec.kafka.version`.
       */
      image?: pulumi.Input<string>;
      /**
       * Storage configuration (disk). Cannot be updated.
       */
      storage: pulumi.Input<KafkaStorage>;
      /**
       * 'The kafka broker config. Properties with the following
       * prefixes cannot be set: listeners, advertised., broker., listener.,
       * host.name, port, inter.broker.listener.name, sasl., ssl., security.,
       * password., principal.builder.class, log.dir, zookeeper.connect,
       * zookeeper.set.acl, authorizer., super.user, cruise.control.metrics.topic,
       * cruise.control.metrics.reporter.bootstrap.servers (with the exception
       * of: zookeeper.connection.timeout.ms, ssl.cipher.suites, ssl.protocol,
       * ssl.enabled.protocols,cruise.control.metrics.topic.num.partitions,
       * cruise.control.metrics.topic.replication.factor,
       * cruise.control.metrics.topic.retention.ms).
       */
      config?: pulumi.Input<{ [key: string]: pulumi.Input<AttributeValue> }>
      /**
       * Configures listeners of Kafka brokers.
       */
      listeners: pulumi.Input<Listeners>;
    }

    export type KafkaStorageType = pulumi.Input<'ephemeral' | 'persistent-claim' | 'jbod'>;

    export interface KafkaStorage {
      /**
       * Storage type, must be either 'ephemeral', 'persistent-claim',
       * or 'jbod'.
       */
      type: pulumi.Input<KafkaStorageType>;
      /**
       * When type=persistent-claim, defines the size of the persistent
       * volume claim (i.e 1Gi). Mandatory when type=persistent-claim.
       */
      size?: pulumi.Input<string>
      /**
       * Specifies if the persistent volume claim has to
       * be deleted when the cluster is un-deployed.
       */
      deleteClaim?: pulumi.Input<boolean>
    }

    export interface Listeners {
      plain?: pulumi.Input<PlainListener>;
      tls?: pulumi.Input<TlsListener>;
    }

    export interface PlainListener {
    }

    export interface TlsListener {
    }

    export interface ZookeeperArgs {
      /**
       * The number of pods in the cluster.
       */
      replicas: pulumi.Input<number>;
      /**
       * Storage configuration (disk). Cannot be updated.
       */
      storage: pulumi.Input<ZookeeperStorage>;
    }

    export type ZookeeperStorageType = pulumi.Input<'ephemeral' | 'persistent-claim'>;

    export interface ZookeeperStorage {
      /**
       * Storage type, must be either 'ephemeral' or 'persistent-claim'.
       */
      type: pulumi.Input<ZookeeperStorageType>;
      /**
       * When type=persistent-claim, defines the size of the persistent
       * volume claim (i.e 1Gi). Mandatory when type=persistent-claim.
       */
      size?: pulumi.Input<string>
      /**
       * Specifies if the persistent volume claim has to
       * be deleted when the cluster is un-deployed.
       */
      deleteClaim?: pulumi.Input<boolean>
    }

    export interface EntityOperator {
      /**
       * Configuration of the Topic Operator.
       */
      topicOperator?: pulumi.Input<TopicOperator>;
      /**
       * Configuration of the User Operator.
       */
      userOperator?: pulumi.Input<UserOperator>;
    }

    export interface TopicOperator {

    }

    export interface UserOperator {

    }

    export interface KafkaTopicArgs {
      cluster: pulumi.Input<string>,
      metadata?: k8s.apiextensions.CustomResourceArgs['metadata'];
      spec: pulumi.Input<TopicArgs>;
    }

    export type AttributeValue = pulumi.Input<string> | pulumi.Input<boolean> | pulumi.Input<number>;

    export interface TopicArgs {
      /**
       * The number of partitions the topic should have. This cannot
       * be decreased after topic creation. It can be increased after topic
       * creation, but it is important to understand the consequences that
       * has, especially for topics with semantic partitioning.
       */
      partitions: pulumi.Input<number>;
      /**
       * The number of replicas the topic should have.
       */
      replicas: pulumi.Input<number>;
      /**
       * The topic configuration.
       */
      config?: pulumi.Input<{ [key: string]: pulumi.Input<AttributeValue> }>
      /**
       * The name of the topic. When absent this will default to
       * the metadata.name of the topic. It is recommended to not set this
       * unless the topic name is not a valid Kubernetes resource name.
       */
      topicName?: pulumi.Input<string>;
    }
  }
}
