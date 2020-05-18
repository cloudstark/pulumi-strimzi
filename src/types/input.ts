import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

export namespace kafka {

  export interface HelmOptions {
    repo: pulumi.Input<string>;
    chart: pulumi.Input<string>;
    version: pulumi.Input<string>;
    namespace?: pulumi.Input<string>;
    values?: pulumi.Inputs;
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
      /**
       * Configuration of the Kafka Exporter. Kafka Exporter can
       * provide additional metrics, for example lag of consumer
       * group at topic/partition.
       */
      kafkaExporter?: pulumi.Input<KafkaExporter>;
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
      /**
       * The Prometheus JMX Exporter configuration.
       * See https://github.com/prometheus/jmx_exporter
       * for details of the structure of this configuration.
       */
      metrics?: pulumi.Input<any>;
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<Resources>
      /**
       * Template for Kafka cluster resources. The template
       * allows users to specify how are the `StatefulSet`, `Pods` and
       * `Services` generated.
       */
      template?: pulumi.Input<KafkaClusterResourceTemplate>;
      /**
       * The kafka broker version. Defaults to {DefaultKafkaVersion}.
       * Consult the user documentation to understand the process required
       * to upgrade or downgrade the version.
       */
      version?: pulumi.Input<string>;
    }

    export type KafkaStorageType = pulumi.Input<'ephemeral' | 'persistent-claim' | 'jbod'>;

    export interface KafkaStorage {
      /**
       * Storage type, must be either 'ephemeral', 'persistent-claim',
       * or 'jbod'.
       */
      type: pulumi.Input<KafkaStorageType>;
      /**
       * The storage class to use for dynamic volume allocation.
       */
      class?: pulumi.Input<string>;
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
      /**
       * Configures plain listener on port 9092.
       */
      plain?: pulumi.Input<PlainListener>;
      /**
       * Configures TLS listener on port 9093.
       */
      tls?: pulumi.Input<TlsListener>;
      /**
       * Configures external listener on port 9094.
       */
      external?: pulumi.Input<ExternalListener>;
    }

    export interface PlainListener {
    }

    export interface TlsListener {
    }

    export interface ExternalListener {

    }
    export interface KafkaClusterResourceTemplate {
      /**
       * Template for Kafka `Pods`.
       */
      pod?: pulumi.Input<PodTemplate>;
    }

    export interface PodTemplate {
      /**
       * Metadata applied to the resource.
       */
      metadata?: pulumi.Input<{
        /**
         * Labels which should be added to the resource
         * template. Can be applied to different resources such
         * as `StatefulSets`, `Deployments`, `Pods`, and `Services`.
         */
        labels?: pulumi.Input<any>;
        /**
         * Annotations which should be added to the
         * resource template. Can be applied to different resources
         * such as `StatefulSets`, `Deployments`, `Pods`, and
         * `Services`.
         */
        annotations?: pulumi.Input<any>;
      }>;
      /**
       * List of references to secrets in the same namespace
       * to use for pulling any of the images used by this Pod.
       */
      imagePullSecrets?: pulumi.Input<Array<pulumi.Input<{
        name: pulumi.Input<string>;
      }>>>;
    }

    export interface ZookeeperArgs {
      /**
       * The number of pods in the cluster.
       */
      replicas: pulumi.Input<number>;
      /**
       * The docker image for the pods.
       */
      image?: pulumi.Input<string>;
      /**
       * Storage configuration (disk). Cannot be updated.
       */
      storage: pulumi.Input<ZookeeperStorage>;
      /**
       * The Prometheus JMX Exporter configuration.
       * See https://github.com/prometheus/jmx_exporter
       * for details of the structure of this configuration.
       */
      metrics?: pulumi.Input<any>;
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<Resources>
      /**
       * Template for ZooKeeper cluster resources. The template
       * allows users to specify how are the `StatefulSet`, `Pods` and
       * `Services` generated.
       */
      template?: pulumi.Input<ZookeeperClusterResourceTemplate>;
    }

    export type ZookeeperStorageType = pulumi.Input<'ephemeral' | 'persistent-claim'>;

    export interface ZookeeperStorage {
      /**
       * Storage type, must be either 'ephemeral' or 'persistent-claim'.
       */
      type: pulumi.Input<ZookeeperStorageType>;
      /**
       * The storage class to use for dynamic volume allocation.
       */
      class?: pulumi.Input<string>;
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
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<Resources>
      /**
       * The image to use for the Topic Operator.
       */
      image?: pulumi.Input<string>;
    }

    export interface UserOperator {
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<Resources>
      /**
       * The image to use for the User Operator.
       */
      image?: pulumi.Input<string>;
    }

    export interface KafkaExporter {
      /**
       * The docker image for the pods.
       */
      image?: pulumi.Input<string>;
      /**
       * Regular expression to specify which consumer groups
       * to collect. Default value is `.*`.
       */
      groupRegex?: pulumi.Input<string>;
      /**
       * Regular expression to specify which topics to collect.
       * Default value is `.*`.
       */
      topicRegex?: pulumi.Input<string>;
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<Resources>;
      /**
       * Customization of deployment templates and pods.
       */
      template?: pulumi.Input<KafkaExporterResourceTemplate>;
    }

    export interface Resources {
      limits?: pulumi.Input<any>;
      requests?: pulumi.Input<any>;
    }

    export interface ZookeeperClusterResourceTemplate {
      /**
       * Template for ZooKeeper `Pods`.
       */
      pod?: pulumi.Input<PodTemplate>;
    }

    export interface KafkaExporterResourceTemplate {
      /**
       * Template for Kafka Exporter `Pods`.
       */
      pod?: pulumi.Input<PodTemplate>;
    }

    export interface KafkaTopicArgs {
      cluster: pulumi.Input<string>,
      metadata?: k8s.apiextensions.CustomResourceArgs['metadata'];
      spec: pulumi.Input<TopicArgs>;
    }

    export type AttributeValue =
      pulumi.Input<string>
      | pulumi.Input<boolean>
      | pulumi.Input<number>;

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
