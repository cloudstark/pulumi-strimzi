import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import {core, policy, meta} from "@pulumi/kubernetes/types/input";

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

    export interface KafkaArgs {
      metadata?: k8s.apiextensions.CustomResourceArgs['metadata'];
      spec: pulumi.Input<KafkaSpec>;
    }

    export interface KafkaSpec {
      /**
       * Configuration of the Kafka cluster.
       */
      kafka: pulumi.Input<KafkaClusterSpec>
      /**
       * Configuration of the ZooKeeper cluster.
       */
      zookeeper: pulumi.Input<ZookeeperClusterSpec>
      /**
       * Configuration of the Entity Operator
       */
      entityOperator?: pulumi.Input<EntityOperatorSpec>;
      /**
       * Configuration of the Kafka Exporter. Kafka Exporter can
       * provide additional metrics, for example lag of consumer
       * group at topic/partition.
       */
      kafkaExporter?: pulumi.Input<KafkaExporterSpec>;
      /**
       * Configuration for Cruise Control deployment. Deploys a
       * Cruise Control instance when specified.
       */
      cruiseControl?: pulumi.Input<CruiseControlSpec>;
    }

    export interface KafkaClusterSpec {
      /**
       * The pod's affinity rules.
       */
      affinity?: pulumi.Input<core.v1.Affinity>;
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
       * The docker image for the pods. The default value depends
       * on the configured `Kafka.spec.kafka.version`.
       */
      image?: pulumi.Input<string>;
      /**
       * JVM Options for pods
       */
      jvmOptions?: pulumi.Input<JvmOptions>;
      /**
       * Pod liveness checking.
       */
      livenessProbe?: pulumi.Input<Probe>;
      /**
       * Pod readiness checking.
       */
      readinessProbe?: pulumi.Input<Probe>;
      /**
       * Configures listeners of Kafka brokers.
       */
      listeners: pulumi.Input<KafkaListeners>;
      /**
       * The Prometheus JMX Exporter configuration.
       * See https://github.com/prometheus/jmx_exporter
       * for details of the structure of this configuration.
       */
      metrics?: pulumi.Input<any>;
      /**
       * The number of pods in the cluster.
       */
      replicas: pulumi.Input<number>;
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * Storage configuration (disk). Cannot be updated.
       */
      storage: pulumi.Input<KafkaStorage>;
      /**
       * Template for Kafka cluster resources. The template
       * allows users to specify how are the `StatefulSet`, `Pods` and
       * `Services` generated.
       */
      template?: pulumi.Input<KafkaClusterTemplate>;
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
      /**
       * The kafka broker version. Defaults to {DefaultKafkaVersion}.
       * Consult the user documentation to understand the process required
       * to upgrade or downgrade the version.
       */
      version?: pulumi.Input<string>;
    }

    export interface JvmOptions {
      /**
       * -Xmx option to to the JVM
       */
      '-Xmx'?: pulumi.Input<string>;
      /**
       * -Xms option to to the JVM
       */
      '-Xms'?: pulumi.Input<string>;
      /**
       * -server option to to the JVM
       */
      '-server'?: pulumi.Input<boolean>;
    }

    export interface Sidecar {
      /**
       * The docker image for the container.
       */
      image?: pulumi.Input<string>;
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
    }

    export interface TlsSidecar extends Sidecar {
      /**
       * The log level for the TLS sidecar. Default value
       * is `notice`.
       */
      logLevel?: pulumi.Input<TlsSidecarLogLevel>;
      /**
       * Pod liveness checking.
       */
      livenessProbe?: pulumi.Input<Probe>;
      /**
       * Pod readiness checking.
       */
      readinessProbe?: pulumi.Input<Probe>;
    }

    export type TlsSidecarLogLevel = pulumi.Input<'emerg' | 'alert' | 'crit' | 'err' | 'warning' | 'notice' | 'info' | 'debug'>

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

    export interface KafkaListeners {
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

    export interface KafkaClusterTemplate {
      /**
       * Template for Kafka `Pods`.
       */
      pod?: pulumi.Input<PodTemplate>;
    }

    export interface Probe {
      /**
       * Minimum consecutive failures for the probe to be considered
       * failed after having succeeded. Defaults to 3. Minimum value is 1.
       */
      failureThreshold?: pulumi.Input<number>;
      /**
       * The initial delay before first the health is first checked.
       */
      initialDelaySeconds?: pulumi.Input<number>;
      /**
       * How often (in seconds) to perform the probe. Default
       * to 10 seconds. Minimum value is 1.
       */
      periodSeconds?: pulumi.Input<number>;
      /**
       * Minimum consecutive successes for the probe to
       * be considered successful after having failed. Defaults to
       * 1. Must be 1 for liveness. Minimum value is 1.
       */
      successThreshold?: pulumi.Input<number>;
      /**
       * The timeout for each attempted health check.
       */
      timeoutSeconds?: pulumi.Input<number>;
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
      imagePullSecrets?: pulumi.Input<Array<pulumi.Input<core.v1.LocalObjectReference>>>;
    }

    export interface ZookeeperClusterSpec {
      /**
       * The pod's affinity rules.
       */
      affinity?: pulumi.Input<core.v1.Affinity>;
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
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * Template for ZooKeeper cluster resources. The template
       * allows users to specify how are the `StatefulSet`, `Pods` and
       * `Services` generated.
       */
      template?: pulumi.Input<ZookeeperClusterResourceTemplate>;
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
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

    export interface EntityOperatorSpec {
      /**
       * The pod's affinity rules.
       */
      affinity?: pulumi.Input<core.v1.Affinity>;
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
      /**
       * Configuration of the Topic Operator.
       */
      topicOperator?: pulumi.Input<EntityTopicOperatorSpec>;
      /**
       * Configuration of the User Operator.
       */
      userOperator?: pulumi.Input<EntityUserOperatorSpec>;
    }

    export interface EntityTopicOperatorSpec {
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
      /**
       * The image to use for the Topic Operator.
       */
      image?: pulumi.Input<string>;
    }

    export interface EntityUserOperatorSpec {
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
      /**
       * The image to use for the User Operator.
       */
      image?: pulumi.Input<string>;
    }

    export interface CruiseControlSpec {
      /**
       * The docker image for the pods.
       */
      image?: pulumi.Input<string>;
    }

    export interface KafkaExporterSpec {
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
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * Customization of deployment templates and pods.
       */
      template?: pulumi.Input<KafkaExporterResourceTemplate>;
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
